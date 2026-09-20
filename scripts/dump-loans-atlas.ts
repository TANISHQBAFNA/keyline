/**
 * Precompute Atlas (force + Louvain) positions for the Loans section graph.
 * Writes a JSON blob the canvas inlines. Not a runtime dependency.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { DesignGraphSchema } from "@/core/model";
import { detectCommunities, indexGraph, projectAtlas } from "@/core/query";
import { createSimulation } from "@/core/layout/force";

const graph = DesignGraphSchema.parse(
  JSON.parse(readFileSync(".graphify/graph.json", "utf8")),
);
const index = indexGraph(graph);
const projection = projectAtlas(index, { collapseInstances: true, minDegree: 0 });
const communities = detectCommunities(
  { nodes: projection.nodes, edges: projection.edges },
  { excludeHubs: true, resolution: 1 },
);

const degree = new Map<string, number>();
for (const edge of projection.edges) {
  degree.set(edge.source, (degree.get(edge.source) ?? 0) + 1);
  degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1);
}

const sim = createSimulation(
  projection.nodes.map((node) => ({
    id: node.id,
    degree: degree.get(node.id) ?? 0,
    community: communities.byNode.get(node.id) ?? -1,
    radius: 2.6 + Math.min(7, Math.sqrt(degree.get(node.id) ?? 0) * 1.5),
  })),
  projection.edges,
  { width: 1800, height: 1300, iterations: 340, seed: 7 },
);
sim.run();

const byId = new Map(projection.nodes.map((node) => [node.id, node]));
const payload = {
  stats: {
    nodes: graph.nodes.length,
    edges: graph.edges.length,
    projectedNodes: projection.nodes.length,
    projectedEdges: projection.edges.length,
    instances: graph.nodes.filter((node) => node.type === "COMPONENT_INSTANCE").length,
    slotFills: graph.nodes.filter(
      (node) =>
        node.type === "COMPONENT_INSTANCE" &&
        index.getHierarchyPath(node.id).some((ancestor) => ancestor.name === "Slot"),
    ).length,
  },
  communities: communities.communities.map((community) => ({
    id: community.id,
    name: community.name,
    size: community.size,
    color: community.color,
  })),
  nodes: sim.nodes.map((node) => {
    const source = byId.get(node.id)!;
    return {
      id: node.id,
      name: source.name,
      type: source.type,
      x: Math.round(node.x * 10) / 10,
      y: Math.round(node.y * 10) / 10,
      r: Math.round(node.radius * 10) / 10,
      community: node.community,
    };
  }),
  edges: projection.edges.map((edge) => ({
    source: edge.source,
    target: edge.target,
    weight: edge.weight,
  })),
};

writeFileSync(".graphify/loans-atlas-layout.json", JSON.stringify(payload));
process.stdout.write(
  `${payload.nodes.length} nodes, ${payload.edges.length} edges, ${payload.communities.length} communities, slot fills ${payload.stats.slotFills}\n`,
);
