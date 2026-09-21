import type { GraphNode } from "@/core/model";
import {
  buildOrientBrief,
  checkFrame,
  computeAnalytics,
  componentUsageCard,
  explainNode,
  extractSubgraph,
  pathBetween,
  queryQuestion,
  screenInventory,
  searchNodes,
  usageCardForComponent,
  usageSummaryFor,
  withCost,
  type GraphIndex,
  type GraphLevel,
  type ViewMode,
} from "@/core/query";
import { buildAiGraphContext, toMarkdownPrompt } from "@/core/ai";
import { listGraphs, resolveGraph } from "./store";

/**
 * Optional MCP tools. Agents: resolve / get_screen_inventory / check_frame.
 * Do not Read graph.json. Graph stays on disk.
 */

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

const graphIdProperty = {
  graphId: {
    type: "string",
    description: "Graph to query. Optional when exactly one graph is stored.",
  },
};

export const TOOLS: ToolDefinition[] = [
  {
    name: "resolve",
    description:
      "Name in, usage card out. Where a component is used (screen names, counts, slot fills, figmaNodeId). Frame names return a screen inventory. Call this instead of reading graph.json. Cap ~2000 chars.",
    inputSchema: {
      type: "object",
      properties: {
        ...graphIdProperty,
        name: { type: "string", description: 'Component or frame name, e.g. "Main Card" or "Portfolio"' },
        budgetChars: { type: "number", description: "Hard cap on JSON chars. Default 2000." },
      },
      required: ["name"],
    },
  },
  {
    name: "orient",
    description:
      "Start here only if you have not called resolve. God nodes and communities. Prefer resolve.",
    inputSchema: { type: "object", properties: { ...graphIdProperty } },
  },
  {
    name: "query",
    description:
      "One-hop answer: similar screens (name + prototype neighbours) and which component variants they nest. Example: 'approval summary buttons' → tertiary on Approval details. Prefer this over walking the page tree.",
    inputSchema: {
      type: "object",
      properties: {
        ...graphIdProperty,
        question: { type: "string", description: 'e.g. "where is Input Field used"' },
        budgetChars: { type: "number", description: "Hard cap on JSON chars. Default 8000." },
      },
      required: ["question"],
    },
  },
  {
    name: "path",
    description:
      "Shortest relationship path between two nodes, by name or id. Foundation edges are excluded unless an endpoint is a style or variable.",
    inputSchema: {
      type: "object",
      properties: {
        ...graphIdProperty,
        from: { type: "string" },
        to: { type: "string" },
      },
      required: ["from", "to"],
    },
  },
  {
    name: "explain",
    description:
      "Bounded markdown brief for one component, frame, or node — by name or id. Use instead of reading the Figma file.",
    inputSchema: {
      type: "object",
      properties: {
        ...graphIdProperty,
        name: { type: "string", description: "Node name or id." },
        task: { type: "string" },
      },
      required: ["name"],
    },
  },
  {
    name: "check_frame",
    description:
      "Given a new screen intent (e.g. 'approval summary buttons'), recommend the variant similar screens nest and list deprecated ones to avoid. Deterministic — does not call an LLM.",
    inputSchema: {
      type: "object",
      properties: {
        ...graphIdProperty,
        intent: { type: "string", description: 'e.g. "approval summary buttons"' },
      },
      required: ["intent"],
    },
  },
  {
    name: "list_graphs",
    description:
      "List every stored Figma graph with its id, file name, size and entry points. Call this first to find out what is available.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "find_nodes",
    description:
      "Search a graph by name, type and relationship. Supports the query language: free text, plus type:, page:, section:, frame:, instance-of:, used-in:, style:, variable:, library:, is: (remote, deprecated, draft, approved), and macros unused-components, deprecated-components, orphaned-frames, unresolved-instances. Prefix a term with - to negate it.",
    inputSchema: {
      type: "object",
      properties: {
        ...graphIdProperty,
        query: { type: "string", description: 'e.g. "type:main Input Field" or "unused-components"' },
        limit: { type: "number", description: "Default 25." },
      },
      required: ["query"],
    },
  },
  {
    name: "get_node",
    description:
      "Everything known about one node: type, location, hierarchy path, counts, styles and variables it uses, its main component, and its Figma deep link.",
    inputSchema: {
      type: "object",
      properties: { ...graphIdProperty, nodeId: { type: "string" } },
      required: ["nodeId"],
    },
  },
  {
    name: "get_screen_inventory",
    description:
      "Which components are used on a screen, frame or section. Each definition once, with a placement count — not every instance. One index lookup.",
    inputSchema: {
      type: "object",
      properties: { ...graphIdProperty, nodeId: { type: "string" } },
      required: ["nodeId"],
    },
  },
  {
    name: "get_component_usage",
    description:
      "Where a component is used and what changing it would affect: instance count, the frames and pages involved, and a risk score.",
    inputSchema: {
      type: "object",
      properties: { ...graphIdProperty, nodeId: { type: "string" } },
      required: ["nodeId"],
    },
  },
  {
    name: "get_related",
    description:
      "Shortest relationship path between two nodes. Foundation edges are excluded unless an endpoint is a style or variable, so two screens are not reported as related merely because they share a colour.",
    inputSchema: {
      type: "object",
      properties: { ...graphIdProperty, fromId: { type: "string" }, toId: { type: "string" } },
      required: ["fromId", "toId"],
    },
  },
  {
    name: "get_subgraph",
    description:
      "A bounded neighbourhood around a node. level: PRODUCT_MAP | PAGE_MAP | FRAME_COMPOSITION | COMPONENT_DEPENDENCY (defaults to whatever suits the node type). viewMode: hierarchy | dependency | usage | prototype.",
    inputSchema: {
      type: "object",
      properties: {
        ...graphIdProperty,
        nodeId: { type: "string" },
        level: { type: "string" },
        viewMode: { type: "string" },
        maxNodes: { type: "number", description: "Default 60, hard cap 300." },
      },
      required: ["nodeId"],
    },
  },
  {
    name: "get_ai_context",
    description:
      "A compact, ready-to-reason-about markdown brief for a node: what it is, where it sits, what it depends on and what depends on it. Use this instead of reading the Figma file.",
    inputSchema: {
      type: "object",
      properties: {
        ...graphIdProperty,
        nodeId: { type: "string" },
        nodeBudget: { type: "number", description: "Max neighbours. Default 40, hard cap 120." },
        task: { type: "string", description: "Optional question to append to the brief." },
      },
      required: ["nodeId"],
    },
  },
  {
    name: "get_health",
    description:
      "Design-system health for a graph: most reused components, components with no instances, frames with no component usage, orphaned screens, and instances whose main component could not be resolved.",
    inputSchema: { type: "object", properties: { ...graphIdProperty } },
  },
];

/* ------------------------------------------------------------------ */

export class ToolError extends Error {}

const asString = (value: unknown, name: string): string => {
  if (typeof value !== "string" || !value) throw new ToolError(`\`${name}\` is required.`);
  return value;
};

const asNumber = (value: unknown, fallback: number, cap: number): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, cap);
};

function context(args: Record<string, unknown>) {
  const graphId = typeof args["graphId"] === "string" ? args["graphId"] : undefined;
  const resolved = resolveGraph(graphId);
  if (!resolved) {
    const available = listGraphs().map((entry) => entry.graphId);
    throw new ToolError(
      available.length
        ? `Unknown or ambiguous graphId. Available: ${available.join(", ")}. Pass one explicitly.`
        : "No graph stored. Ingest once: `FIGMA_ACCESS_TOKEN=… npm run resolve -- ingest <figma-url>`. Then resolve, do not Read graph.json.",
    );
  }
  return resolved;
}

function requireNode(index: GraphIndex, nodeId: string): GraphNode {
  const node = index.getNode(nodeId);
  if (!node) throw new ToolError(`Node \`${nodeId}\` is not in this graph.`);
  return node;
}

/** Small projection — an agent does not need the raw metadata bag. */
const brief = (node: GraphNode) => ({
  id: node.id,
  name: node.name,
  type: node.type,
  figmaNodeId: node.figmaNodeId,
  status: node.status,
  owner: node.owner,
});

export function callTool(name: string, rawArgs: unknown): unknown {
  const args = (rawArgs && typeof rawArgs === "object" ? rawArgs : {}) as Record<string, unknown>;
  const result = dispatchTool(name, args);
  if (result && typeof result === "object" && "cost" in result) return result;
  if (result && typeof result === "object" && !Array.isArray(result)) return withCost(result);
  return result;
}

function dispatchTool(name: string, args: Record<string, unknown>): unknown {
  switch (name) {
    case "resolve": {
      const { index } = context(args);
      const budget = typeof args["budgetChars"] === "number" ? args["budgetChars"] : undefined;
      return componentUsageCard(index, asString(args["name"] ?? args["query"], "name"), {
        budgetChars: budget,
      });
    }

    case "orient": {
      const { index, graphId } = context(args);
      return withCost({ graphId, ...buildOrientBrief(index) });
    }

    case "query": {
      const { index } = context(args);
      const question = asString(args["question"] ?? args["query"], "question");
      const budget = typeof args["budgetChars"] === "number" ? args["budgetChars"] : undefined;
      return queryQuestion(index, question, { budgetChars: budget });
    }

    case "path": {
      const { index } = context(args);
      return pathBetween(
        index,
        asString(args["from"] ?? args["fromId"], "from"),
        asString(args["to"] ?? args["toId"], "to"),
      );
    }

    case "explain": {
      const { index } = context(args);
      const task = typeof args["task"] === "string" ? args["task"] : undefined;
      return explainNode(index, asString(args["name"] ?? args["nodeId"], "name"), task);
    }

    case "check_frame": {
      const { index } = context(args);
      return checkFrame(index, asString(args["intent"] ?? args["question"], "intent"));
    }

    case "list_graphs": {
      const graphs = listGraphs();
      return {
        graphs,
        hint: graphs.length
          ? "Call resolve \"<component>\" (usage card), then Figma on that figmaNodeId. Do not Read graph.json."
          : "Nothing stored yet. Ingest a Figma URL or JSON export first.",
      };
    }

    case "find_nodes": {
      const { index, graphId } = context(args);
      const query = asString(args["query"], "query");
      const limit = asNumber(args["limit"], 25, 100);
      const results = searchNodes(index, query, { limit });
      return {
        graphId,
        query,
        count: results.length,
        results: results.map((result) => ({
          ...brief(result.node),
          matchedOn: result.matchedOn,
          isMainComponent: result.node.isMainComponent || undefined,
          isInstance: result.node.isInstance || undefined,
        })),
      };
    }

    case "get_node": {
      const { index, graphId } = context(args);
      const node = requireNode(index, asString(args["nodeId"], "nodeId"));
      const main = node.mainComponentId ? index.getNode(node.mainComponentId) : undefined;

      return {
        graphId,
        node: {
          ...brief(node),
          description: node.description,
          isMainComponent: node.isMainComponent,
          isInstance: node.isInstance,
          isRemote: node.isRemote,
          variantProperties: node.variantProperties,
          figmaUrl: node.figmaUrl,
          identity: node.metadata?.["identity"],
          platforms: node.platforms,
        },
        path: index.getHierarchyPath(node.id).map(brief),
        summary: usageSummaryFor(index, node.id),
        mainComponent: main ? brief(main) : undefined,
        children: index.getChildren(node.id).slice(0, 25).map(brief),
        styles: index.getNodes(node.styleIds ?? []).map(brief),
        variables: index.getNodes(node.variableIds ?? []).map(brief),
      };
    }

    case "get_screen_inventory": {
      const { index, graphId } = context(args);
      const node = requireNode(index, asString(args["nodeId"], "nodeId"));
      const inventory = screenInventory(index, node.id);
      return { graphId, ...inventory };
    }

    case "get_component_usage": {
      const { index, graphId } = context(args);
      const node = requireNode(index, asString(args["nodeId"], "nodeId"));
      return { graphId, ...usageCardForComponent(index, node) };
    }

    case "get_related": {
      const { index, graphId } = context(args);
      const fromId = asString(args["fromId"], "fromId");
      const toId = asString(args["toId"], "toId");
      requireNode(index, fromId);
      requireNode(index, toId);
      return { graphId, ...pathBetween(index, fromId, toId) };
    }

    case "get_subgraph": {
      const { index, graphId } = context(args);
      const nodeId = asString(args["nodeId"], "nodeId");
      requireNode(index, nodeId);

      const subgraph = extractSubgraph(index, {
        focusId: nodeId,
        level: args["level"] as GraphLevel | undefined,
        viewMode: (args["viewMode"] as ViewMode | undefined) ?? "hierarchy",
        maxNodes: asNumber(args["maxNodes"], 60, 300),
      });

      return {
        graphId,
        focusId: subgraph.focusId,
        level: subgraph.level,
        viewMode: subgraph.viewMode,
        truncated: subgraph.truncated,
        hiddenCount: subgraph.hiddenCount,
        nodes: subgraph.nodes.map(brief),
        edges: subgraph.edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
          type: edge.type,
        })),
      };
    }

    case "get_ai_context": {
      const { index, graphId } = context(args);
      const nodeId = asString(args["nodeId"], "nodeId");
      requireNode(index, nodeId);

      const aiContext = buildAiGraphContext(index, nodeId, {
        nodeBudget: asNumber(args["nodeBudget"], 40, 120),
      });
      if (!aiContext) throw new ToolError(`Could not build context for \`${nodeId}\`.`);

      const task = typeof args["task"] === "string" ? args["task"] : undefined;
      return {
        graphId,
        nodes: aiContext.neighbors.length + 1,
        edges: aiContext.edges.length,
        truncated: aiContext.meta.truncated,
        markdown: toMarkdownPrompt(aiContext, task),
      };
    }

    case "get_health": {
      const { index, graphId } = context(args);
      const analytics = computeAnalytics(index);
      return {
        graphId,
        totals: analytics.totals,
        mostReused: analytics.componentUsage
          .slice(0, 10)
          .map((usage) => ({ ...brief(usage.component), instances: usage.instanceCount })),
        unusedComponents: analytics.unusedComponents.map(brief),
        framesWithoutComponents: analytics.framesWithoutComponents.map(brief),
        orphanedFrames: analytics.orphanedFrames.map(brief),
        unresolvedInstances: analytics.unresolvedInstances.map(brief),
      };
    }

    default:
      throw new ToolError(`Unknown tool \`${name}\`.`);
  }
}
