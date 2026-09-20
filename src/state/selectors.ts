import { useMemo } from "react";
import type { GraphNode } from "@/core/model";
import {
  applyFilters,
  detectCommunities,
  extractSubgraph,
  isEmptyQuery,
  levelForNode,
  projectAtlas,
  searchNodes,
  type AtlasProjection,
  type CommunityResult,
  type SearchResult,
  type Subgraph,
} from "@/core/query";
import { useGraphStore } from "./graphStore";

/**
 * The rendered subgraph: level + view mode + manual expansions + filters.
 * Everything the canvas draws comes from here, never from the whole graph.
 */
export function useSubgraph(): Subgraph | undefined {
  const index = useGraphStore((state) => state.index);
  const analytics = useGraphStore((state) => state.analytics);
  const focusId = useGraphStore((state) => state.focusId);
  const viewMode = useGraphStore((state) => state.viewMode);
  const level = useGraphStore((state) => state.level);
  const expandedIds = useGraphStore((state) => state.expandedIds);
  const filters = useGraphStore((state) => state.filters);

  return useMemo(() => {
    if (!index || !focusId || !analytics) return undefined;
    const focus = index.getNode(focusId);
    const resolvedLevel = level === "auto" ? levelForNode(focus) : level;

    const subgraph = extractSubgraph(index, {
      focusId,
      level: resolvedLevel,
      viewMode,
      expandedIds,
    });

    const kept = new Set(
      applyFilters(index, subgraph.nodes, filters, analytics).map((node) => node.id),
    );
    kept.add(focusId);

    const nodes = subgraph.nodes.filter((node) => kept.has(node.id));
    const edges = subgraph.edges.filter(
      (edge) => kept.has(edge.source) && kept.has(edge.target),
    );

    return {
      ...subgraph,
      level: resolvedLevel,
      nodes,
      edges,
      hiddenCount: subgraph.hiddenCount + (subgraph.nodes.length - nodes.length),
    };
  }, [index, analytics, focusId, viewMode, level, expandedIds, filters]);
}

/** Search + filters applied over the whole graph, for the node browser. */
export function useBrowserResults(limit = 300): { results: SearchResult[]; total: number } {
  const index = useGraphStore((state) => state.index);
  const analytics = useGraphStore((state) => state.analytics);
  const query = useGraphStore((state) => state.query);
  const filters = useGraphStore((state) => state.filters);

  return useMemo(() => {
    if (!index || !analytics) return { results: [], total: 0 };

    const candidates: GraphNode[] = applyFilters(index, index.allNodes, filters, analytics);

    if (isEmptyQuery(query)) {
      const ranked = [...candidates]
        .sort((a, b) => rankType(a) - rankType(b) || a.name.localeCompare(b.name))
        .slice(0, limit)
        .map((node) => ({ node, score: 0, matchedOn: [] }));
      return { results: ranked, total: candidates.length };
    }

    const results = searchNodes(index, query, { analytics, candidates, limit });
    return { results, total: results.length };
  }, [index, analytics, query, filters, limit]);
}

const TYPE_ORDER: Record<string, number> = {
  FILE: 0,
  PAGE: 1,
  SECTION: 2,
  FRAME: 3,
  COMPONENT_SET: 4,
  MAIN_COMPONENT: 5,
  VARIANT: 6,
  COMPONENT_INSTANCE: 7,
  VARIABLE_COLLECTION: 8,
  VARIABLE: 9,
  STYLE: 10,
  EXTERNAL_LIBRARY: 11,
};

function rankType(node: GraphNode): number {
  return TYPE_ORDER[node.type] ?? 50;
}


export interface AtlasView {
  projection: AtlasProjection;
  communities: CommunityResult;
  /** For a collapsed component: how many instances folded into it. */
  usage: Map<string, number>;
}

/**
 * The whole-file view: project (collapse instances), partition into
 * communities, and hand both to the canvas. Recomputed only when the graph or
 * the atlas settings change — community toggles are a draw-time concern.
 */
export function useAtlas(): AtlasView | undefined {
  const index = useGraphStore((state) => state.index);
  const collapseInstances = useGraphStore((state) => state.atlas.collapseInstances);
  const resolution = useGraphStore((state) => state.atlas.resolution);
  const excludeHubs = useGraphStore((state) => state.atlas.excludeHubs);
  const minDegree = useGraphStore((state) => state.atlas.minDegree);

  return useMemo(() => {
    if (!index) return undefined;

    const projection = projectAtlas(index, { collapseInstances, minDegree });
    const communities = detectCommunities(
      { nodes: projection.nodes, edges: projection.edges },
      { resolution, excludeHubs },
    );

    const usage = new Map<string, number>();
    for (const target of projection.collapsed.values()) {
      usage.set(target, (usage.get(target) ?? 0) + 1);
    }

    return { projection, communities, usage };
  }, [index, collapseInstances, resolution, excludeHubs, minDegree]);
}
