import { describe, expect, it } from "vitest";
import { edgeId, type DesignGraph, type GraphEdge, type GraphNode } from "@/core/model";
import { createSimulation } from "@/core/layout/force";
import { computeAnalytics, detectCommunities, indexGraph, projectAtlas, searchNodes } from "@/core/query";

const SIZE = 10_000;

function soakGraph(): DesignGraph {
  const file: GraphNode = { id: "file:soak", type: "FILE", name: "Soak" };
  const page: GraphNode = { id: "node:page", type: "PAGE", name: "Page", parentId: file.id };
  const hub: GraphNode = {
    id: "node:hub",
    type: "MAIN_COMPONENT",
    name: "Hub",
    isMainComponent: true,
    parentId: page.id,
    pageId: page.id,
  };
  const nodes: GraphNode[] = [file, page, hub];
  const edges: GraphEdge[] = [
    { id: edgeId("CONTAINS", file.id, page.id), source: file.id, target: page.id, type: "CONTAINS" },
    { id: edgeId("CONTAINS", page.id, hub.id), source: page.id, target: hub.id, type: "CONTAINS" },
  ];

  for (let i = 0; i < SIZE - 3; i += 1) {
    const id = `node:i${i}`;
    nodes.push({
      id,
      type: "COMPONENT_INSTANCE",
      name: `Use ${i}`,
      isInstance: true,
      mainComponentId: hub.id,
      parentId: page.id,
      pageId: page.id,
    });
    edges.push({
      id: edgeId("INSTANCE_OF", id, hub.id),
      source: id,
      target: hub.id,
      type: "INSTANCE_OF",
    });
    edges.push({
      id: edgeId("CONTAINS", page.id, id),
      source: page.id,
      target: id,
      type: "CONTAINS",
    });
  }

  return {
    fileKey: "soak",
    fileName: "Soak",
    builtAt: "2026-01-01T00:00:00.000Z",
    source: { kind: "json", ingestedAt: "2026-01-01T00:00:00.000Z" },
    nodes,
    edges,
    warnings: [],
  };
}

describe("10k-node soak", () => {
  it("indexes, queries, projects, and lays out without throwing", () => {
    const graph = soakGraph();
    expect(graph.nodes.length).toBe(SIZE);

    const index = indexGraph(graph);
    const analytics = computeAnalytics(index);
    expect(analytics.totals.instances).toBe(SIZE - 3);

    const hits = searchNodes(index, "instance-of:Hub", { analytics, limit: 50 });
    expect(hits.length).toBe(50);

    const projection = projectAtlas(index, { collapseInstances: true });
    expect(projection.stats.collapsedInstances).toBe(SIZE - 3);
    expect(projection.nodes.length).toBeLessThan(20);

    const communities = detectCommunities({
      nodes: projection.nodes,
      edges: projection.edges,
    });
    expect(communities.byNode.size).toBe(projection.nodes.length);

    const laid = createSimulation(
      projection.nodes.map((node) => ({
        id: node.id,
        degree: 1,
        community: communities.byNode.get(node.id) ?? 0,
      })),
      projection.edges,
      { iterations: 8, seed: 1 },
    ).run();
    expect(laid.every((node) => Number.isFinite(node.x) && Number.isFinite(node.y))).toBe(true);
  }, 30_000);
});
