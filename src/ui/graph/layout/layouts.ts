import dagre from "@dagrejs/dagre";
import type { Edge, Node } from "@xyflow/react";

export const NODE_WIDTH = 224;
export const NODE_HEIGHT = 68;

export type LayoutKind = "hierarchical" | "radial";

/**
 * Hierarchical (dagre) layout — the right read for containment and flow.
 */
export function hierarchicalLayout<T extends Node>(
  nodes: T[],
  edges: Edge[],
  direction: "LR" | "TB" = "LR",
): T[] {
  if (!nodes.length) return nodes;

  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: direction, nodesep: 28, ranksep: 96, marginx: 40, marginy: 40 });

  for (const node of nodes) {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  const ids = new Set(nodes.map((node) => node.id));
  for (const edge of edges) {
    if (ids.has(edge.source) && ids.has(edge.target)) graph.setEdge(edge.source, edge.target);
  }

  dagre.layout(graph);

  return nodes.map((node) => {
    const positioned = graph.node(node.id);
    if (!positioned) return node;
    return {
      ...node,
      position: { x: positioned.x - NODE_WIDTH / 2, y: positioned.y - NODE_HEIGHT / 2 },
    };
  });
}

/**
 * Radial layout — concentric rings by hop distance from the focus node.
 *
 * Deterministic (no simulation, no jitter) but reads like a dependency map:
 * what is one hop away sits closest to the thing you selected.
 */
export function radialLayout<T extends Node>(nodes: T[], edges: Edge[], focusId: string): T[] {
  if (!nodes.length) return nodes;

  const adjacency = new Map<string, string[]>();
  const link = (a: string, b: string) => {
    const bucket = adjacency.get(a);
    if (bucket) bucket.push(b);
    else adjacency.set(a, [b]);
  };
  for (const edge of edges) {
    link(edge.source, edge.target);
    link(edge.target, edge.source);
  }

  const root = nodes.some((node) => node.id === focusId) ? focusId : nodes[0]!.id;
  const ring = new Map<string, number>([[root, 0]]);
  const queue = [root];
  while (queue.length) {
    const current = queue.shift()!;
    const depth = ring.get(current) ?? 0;
    for (const neighbor of adjacency.get(current) ?? []) {
      if (ring.has(neighbor)) continue;
      ring.set(neighbor, depth + 1);
      queue.push(neighbor);
    }
  }

  // Anything unreachable goes on an outer ring rather than being dropped.
  const maxRing = Math.max(0, ...ring.values());
  for (const node of nodes) if (!ring.has(node.id)) ring.set(node.id, maxRing + 1);

  const byRing = new Map<number, T[]>();
  for (const node of nodes) {
    const depth = ring.get(node.id) ?? 0;
    const bucket = byRing.get(depth);
    if (bucket) bucket.push(node);
    else byRing.set(depth, [node]);
  }

  const positioned: T[] = [];
  for (const [depth, ringNodes] of [...byRing.entries()].sort((a, b) => a[0] - b[0])) {
    if (depth === 0) {
      for (const node of ringNodes) positioned.push({ ...node, position: { x: 0, y: 0 } });
      continue;
    }
    // Radius grows with both depth and crowding so labels do not collide.
    const radius = Math.max(300 * depth, (ringNodes.length * (NODE_WIDTH + 40)) / (2 * Math.PI));
    const sorted = [...ringNodes].sort((a, b) => a.id.localeCompare(b.id));
    sorted.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / sorted.length - Math.PI / 2;
      positioned.push({
        ...node,
        position: { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius * 0.72 },
      });
    });
  }

  return positioned;
}
