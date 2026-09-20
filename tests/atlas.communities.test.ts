import { describe, expect, it } from "vitest";
import type { EdgeType, GraphNode, NodeType } from "@/core/model";
import { detectCommunities, projectAtlas } from "@/core/query";
import { createSimulation } from "@/core/layout/force";
import { cbx300PortfolioSource } from "@/core/ingestion/adapters/mcpSource";
import { buildGraph } from "@/core/transform";
import { indexGraph } from "@/core/query";
import { index as mockIndex, ids } from "./fixture";

const node = (id: string, type: NodeType = "FRAME"): GraphNode => ({ id, name: id, type });
const edge = (source: string, target: string, type: EdgeType = "CONTAINS") => ({
  source,
  target,
  type,
});

describe("community detection", () => {
  it("separates two cliques joined by a single bridge", () => {
    const nodes = ["a1", "a2", "a3", "b1", "b2", "b3"].map((id) => node(id));
    const edges = [
      edge("a1", "a2"),
      edge("a2", "a3"),
      edge("a3", "a1"),
      edge("b1", "b2"),
      edge("b2", "b3"),
      edge("b3", "b1"),
      edge("a1", "b1"),
    ];

    const result = detectCommunities({ nodes, edges });
    expect(result.communities).toHaveLength(2);
    expect(result.byNode.get("a1")).toBe(result.byNode.get("a3"));
    expect(result.byNode.get("b1")).toBe(result.byNode.get("b3"));
    expect(result.byNode.get("a1")).not.toBe(result.byNode.get("b1"));
    expect(result.modularity).toBeGreaterThan(0.2);
  });

  it("is deterministic — the same graph always partitions the same way", () => {
    const input = { nodes: mockIndex.allNodes, edges: mockIndex.allEdges };
    const first = detectCommunities(input);
    const second = detectCommunities(input);
    expect(second.communities.map((c) => [c.name, c.size])).toEqual(
      first.communities.map((c) => [c.name, c.size]),
    );
    expect(second.modularity).toBe(first.modularity);
  });

  it("names a community after its highest-degree member", () => {
    const nodes = [node("hub"), node("x"), node("y"), node("z")];
    const edges = [edge("hub", "x"), edge("hub", "y"), edge("hub", "z")];
    const result = detectCommunities({ nodes, edges });
    expect(result.communities[0]?.name).toBe("hub");
    expect(result.communities[0]?.hubId).toBe("hub");
  });

  it("assigns every node to exactly one community", () => {
    const result = detectCommunities({ nodes: mockIndex.allNodes, edges: mockIndex.allEdges });
    const seen = new Set<string>();
    for (const community of result.communities) {
      for (const id of community.nodeIds) {
        expect(seen.has(id)).toBe(false);
        seen.add(id);
      }
    }
    expect(seen.size).toBe(mockIndex.allNodes.length);
  });

  it("gives each community a distinct colour slot and a stable id order", () => {
    const result = detectCommunities({ nodes: mockIndex.allNodes, edges: mockIndex.allEdges });
    result.communities.forEach((community, i) => {
      expect(community.id).toBe(i);
      expect(community.color).toMatch(/^#[0-9a-f]{6}$/i);
    });
    // Sorted largest first.
    const sizes = result.communities.map((community) => community.size);
    expect([...sizes].sort((a, b) => b - a)).toEqual(sizes);
  });

  it("splits further as resolution rises", () => {
    const coarse = detectCommunities(
      { nodes: mockIndex.allNodes, edges: mockIndex.allEdges },
      { resolution: 0.5 },
    );
    const fine = detectCommunities(
      { nodes: mockIndex.allNodes, edges: mockIndex.allEdges },
      { resolution: 2.2 },
    );
    expect(fine.communities.length).toBeGreaterThanOrEqual(coarse.communities.length);
  });

  it("still places excluded hubs somewhere", () => {
    const result = detectCommunities(
      { nodes: mockIndex.allNodes, edges: mockIndex.allEdges },
      { excludeHubs: true },
    );
    expect(result.excludedHubs.length).toBeGreaterThan(0);
    for (const hubId of result.excludedHubs) {
      expect(result.byNode.has(hubId)).toBe(true);
    }
  });
});

describe("atlas projection", () => {
  it("folds every instance onto its main component", () => {
    const projection = projectAtlas(mockIndex);
    // 26 instances, 25 resolvable. The one whose main component is missing from
    // the payload has nothing to fold into, so it stays a node of its own —
    // which is exactly the signal you want to see in the atlas.
    expect(projection.stats.collapsedInstances).toBe(25);
    const survivors = projection.nodes.filter((n) => n.type === "COMPONENT_INSTANCE");
    expect(survivors.map((n) => n.id)).toEqual([ids.instanceUnresolved]);
    // One node per main component, not one per placement.
    expect(projection.nodes.filter((n) => n.id === ids.buttonPrimaryMedium)).toHaveLength(1);
  });

  it("turns repeated placements into edge weight", () => {
    const projection = projectAtlas(mockIndex);
    const used = projection.edges.filter(
      (edge) => edge.type === "USED_IN" && edge.source === ids.avatar,
    );
    expect(used.length).toBeGreaterThan(0);
    const total = used.reduce((sum, edge) => sum + edge.weight, 0);
    // Seven Avatar instances, spread across the containers that hold them.
    expect(total).toBeGreaterThanOrEqual(7);
  });

  it("points usage edges from the component to the container", () => {
    const projection = projectAtlas(mockIndex);
    const edge = projection.edges.find(
      (candidate) => candidate.source === ids.buttonPrimaryMedium && candidate.type === "USED_IN",
    );
    expect(edge).toBeDefined();
    expect(edge?.metadata?.["projected"]).toBe(true);
  });

  it("keeps instances when collapsing is off", () => {
    const projection = projectAtlas(mockIndex, { collapseInstances: false });
    expect(projection.stats.collapsedInstances).toBe(0);
    expect(projection.nodes.some((n) => n.type === "COMPONENT_INSTANCE")).toBe(true);
  });

  it("drops leaves below the minimum degree", () => {
    const kept = projectAtlas(mockIndex, { minDegree: 2 });
    const all = projectAtlas(mockIndex, { minDegree: 0 });
    expect(kept.stats.nodes).toBeLessThan(all.stats.nodes);
    expect(kept.stats.droppedByDegree).toBeGreaterThan(0);
  });

  it("never emits an edge pointing at a dropped node", () => {
    const projection = projectAtlas(mockIndex, { minDegree: 2 });
    const present = new Set(projection.nodes.map((n) => n.id));
    for (const edge of projection.edges) {
      expect(present.has(edge.source)).toBe(true);
      expect(present.has(edge.target)).toBe(true);
    }
  });

  it("collapses a real file down to one node per component", async () => {
    const index = indexGraph(buildGraph(await cbx300PortfolioSource.load()));
    const projection = projectAtlas(index);
    expect(projection.stats.collapsedInstances).toBe(87);
    // 87 placements, 20 components.
    expect(projection.nodes.filter((n) => n.isMainComponent)).toHaveLength(20);
    expect(projection.stats.nodes).toBeLessThan(index.nodeCount);
  });
});

describe("force layout", () => {
  const nodes = Array.from({ length: 40 }, (_, i) => ({
    id: `n${i}`,
    degree: 2,
    community: i % 4,
  }));
  const edges = nodes.slice(1).map((n, i) => ({ source: n.id, target: `n${i}`, weight: 1 }));

  it("settles and reports progress", () => {
    const simulation = createSimulation(nodes, edges, { iterations: 60 });
    expect(simulation.progress()).toBe(0);
    simulation.run();
    expect(simulation.progress()).toBe(1);
    expect(simulation.tick()).toBe(0);
  });

  it("is deterministic for a given seed", () => {
    const a = createSimulation(nodes, edges, { iterations: 60, seed: 42 }).run();
    const b = createSimulation(nodes, edges, { iterations: 60, seed: 42 }).run();
    expect(a.map((n) => [n.x, n.y])).toEqual(b.map((n) => [n.x, n.y]));
  });

  it("produces finite coordinates for every node", () => {
    const laid = createSimulation(nodes, edges, { iterations: 80 }).run();
    for (const node of laid) {
      expect(Number.isFinite(node.x)).toBe(true);
      expect(Number.isFinite(node.y)).toBe(true);
    }
  });

  it("keeps disconnected nodes on the canvas instead of flinging them away", () => {
    const isolated = [...nodes, { id: "lonely", degree: 0, community: 9 }];
    const laid = createSimulation(isolated, edges, { iterations: 120 }).run();
    const lonely = laid.find((n) => n.id === "lonely")!;
    expect(Math.hypot(lonely.x, lonely.y)).toBeLessThan(4000);
  });
});
