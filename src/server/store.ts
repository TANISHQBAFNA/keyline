import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { DesignGraphSchema, type DesignGraph } from "@/core/model";
import {
  indexGraph,
  mergeRecipes,
  parseLibraryRules,
  parseRecipeFile,
  starterRecipes,
  type GraphIndex,
  type LibraryRules,
  type Recipe,
} from "@/core/query";

/**
 * Durable graph store. One file:
 *
 *   .graphify/graph.json
 *
 * Optional designer files next to it: library-rules.json, recipes.json.
 * Nodes + edges (CONTAINS, INSTANCE_OF, NESTS, …). Agents call recipe /
 * recommend / resolve — they do not Read the graph file.
 */

export interface StoredGraphSummary {
  graphId: string;
  fileKey: string;
  fileName: string;
  sourceKind: string;
  nodes: number;
  edges: number;
  warnings: number;
  savedAt: string;
  /** Roots the agent can start from — pages, or captured frames. */
  entryPoints: Array<{ id: string; name: string; type: string; figmaNodeId?: string }>;
}

export interface StoreIndex {
  version: 1;
  graphs: StoredGraphSummary[];
}

export function storeRoot(): string {
  return resolve(process.env["GRAPHIFY_HOME"] ?? join(process.cwd(), ".graphify"));
}

export function graphPath(): string {
  return join(storeRoot(), "graph.json");
}

/** Optional allow/deny list next to graph.json. Missing file = graph status rules. */
export function libraryRulesPath(): string {
  return join(storeRoot(), "library-rules.json");
}

/** Designer-editable recipe overlay next to graph.json. Missing file = starter pack only. */
export function recipesPath(): string {
  return join(storeRoot(), "recipes.json");
}

export function readRecipeOverlay(explicitPath?: string): Recipe[] {
  const path = explicitPath ?? (existsSync(recipesPath()) ? recipesPath() : undefined);
  if (!path) return [];
  if (!existsSync(path)) {
    throw new Error(`Recipes file not found: ${path}`);
  }
  const raw: unknown = JSON.parse(readFileSync(path, "utf8"));
  return parseRecipeFile(raw);
}

export function loadRecipes(explicitPath?: string): Recipe[] {
  return mergeRecipes(starterRecipes(), readRecipeOverlay(explicitPath));
}

export function readLibraryRules(explicitPath?: string): LibraryRules | undefined {
  const path = explicitPath ?? (existsSync(libraryRulesPath()) ? libraryRulesPath() : undefined);
  if (!path) return undefined;
  if (!existsSync(path)) {
    throw new Error(`Library rules file not found: ${path}`);
  }
  const raw: unknown = JSON.parse(readFileSync(path, "utf8"));
  return parseLibraryRules(raw);
}

/** Stable id derived from the file it came from. Display only — the file is always graph.json. */
export function graphIdFor(fileKey: string, fileName: string): string {
  const slug = fileName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const key = fileKey.replace(/[^A-Za-z0-9]/g, "").slice(0, 12);
  return `${slug || "file"}-${key || "local"}`;
}

function summarise(graphId: string, graph: DesignGraph): StoredGraphSummary {
  const fileNode = graph.nodes.find((node) => node.type === "FILE");
  const entryPoints = graph.nodes
    .filter((node) => node.parentId === fileNode?.id)
    .slice(0, 40)
    .map((node) => ({
      id: node.id,
      name: node.name,
      type: node.type,
      figmaNodeId: node.figmaNodeId,
    }));

  return {
    graphId,
    fileKey: graph.fileKey,
    fileName: graph.fileName,
    sourceKind: graph.source.kind,
    nodes: graph.nodes.length,
    edges: graph.edges.length,
    warnings: graph.warnings.length,
    savedAt: new Date().toISOString(),
    entryPoints,
  };
}

const LEGACY_FILES = ["GRAPH_REPORT.md", "index.json"] as const;
const LEGACY_DIRS = ["reports", "graphs"] as const;

function removeLegacySidecars(): void {
  for (const name of LEGACY_FILES) {
    const path = join(storeRoot(), name);
    if (existsSync(path)) rmSync(path);
  }
  for (const name of LEGACY_DIRS) {
    const path = join(storeRoot(), name);
    if (existsSync(path)) rmSync(path, { recursive: true });
  }
}

export function saveGraph(graph: DesignGraph, graphId?: string): StoredGraphSummary {
  mkdirSync(storeRoot(), { recursive: true });
  writeFileSync(graphPath(), JSON.stringify(graph, null, 2) + "\n");
  removeLegacySidecars();
  cache.clear();
  const id = graphId ?? graphIdFor(graph.fileKey, graph.fileName);
  return summarise(id, graph);
}

export function deleteGraph(_graphId?: string): boolean {
  const path = graphPath();
  if (!existsSync(path)) return false;
  rmSync(path);
  cache.clear();
  return true;
}

export function listGraphs(): StoredGraphSummary[] {
  const loaded = loadGraph();
  if (!loaded) return [];
  return [summarise(graphIdFor(loaded.graph.fileKey, loaded.graph.fileName), loaded.graph)];
}

/** No sidecar index. Kept so CLI `reindex` still runs. */
export function rebuildIndex(): StoreIndex {
  return { version: 1, graphs: listGraphs() };
}

const cache = new Map<string, { graph: DesignGraph; index: GraphIndex }>();

export function loadGraph(_graphId?: string): { graph: DesignGraph; index: GraphIndex } | undefined {
  const cached = cache.get("graph");
  if (cached) return cached;

  const path = graphPath();
  if (!existsSync(path)) return undefined;

  const graph = DesignGraphSchema.parse(JSON.parse(readFileSync(path, "utf8")));
  const entry = { graph, index: indexGraph(graph) };
  cache.set("graph", entry);
  return entry;
}

/** The one stored graph. `graphId` is ignored — there is only graph.json. */
export function resolveGraph(
  graphId?: string,
): { graph: DesignGraph; index: GraphIndex; graphId: string } | undefined {
  const loaded = loadGraph();
  if (!loaded) return undefined;
  const id = graphId ?? graphIdFor(loaded.graph.fileKey, loaded.graph.fileName);
  return { ...loaded, graphId: id };
}

export function clearCache(): void {
  cache.clear();
}
