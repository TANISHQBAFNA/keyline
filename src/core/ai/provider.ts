import type { AiGraphContext } from "./context";
import { toMarkdownPrompt } from "./serialize";

/**
 * Provider-agnostic LLM seam.
 *
 * Phase 1 ships the interface and the prompt catalogue only — the app builds
 * payloads and lets the user copy them. Phase 4 registers real providers
 * (Anthropic, OpenAI-compatible, Cursor, an MCP tool) behind this contract
 * without touching the graph layers.
 */

export interface LlmMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LlmRequest {
  messages: LlmMessage[];
  /** The bounded subgraph this request is about. */
  context?: AiGraphContext;
  maxOutputTokens?: number;
  temperature?: number;
}

export interface AiActionDefinition {
  id: string;
  label: string;
  description: string;
  /** Node types this action makes sense for. Empty = any. */
  appliesTo: string[];
  task: string;
}

export const AI_ACTIONS: AiActionDefinition[] = [
  {
    id: "explain-node",
    label: "Explain this node",
    description: "Plain-language description of what this node is and how it is built.",
    appliesTo: [],
    task: "Explain what this node is, how it is composed, and what it depends on. Be concrete and reference nodes by name.",
  },
  {
    id: "impact-analysis",
    label: "Impact analysis",
    description: "What breaks if this changes.",
    appliesTo: ["MAIN_COMPONENT", "VARIANT", "COMPONENT_SET", "STYLE", "VARIABLE"],
    task: "List every page and frame affected if this node changes, grouped by page, and call out the highest-risk usages first.",
  },
  {
    id: "screen-components",
    label: "Components on this screen",
    description: "Inventory of the component instances used by a frame.",
    appliesTo: ["FRAME", "AUTO_LAYOUT_CONTAINER", "SECTION", "PAGE"],
    task: "List the component instances used here, grouped by main component, and flag anything not backed by a main component.",
  },
  {
    id: "duplication-check",
    label: "Find duplication",
    description: "Layers that look hand-built instead of reused.",
    appliesTo: [],
    task: "Identify structures that appear to be rebuilt manually rather than reusing an existing main component, and suggest which component they should use.",
  },
  {
    id: "flow-summary",
    label: "Summarise this flow",
    description: "Narrate the prototype flow through these frames.",
    appliesTo: ["PAGE", "SECTION", "FRAME"],
    task: "Summarise the user flow implied by the prototype relationships, step by step, and note any dead ends.",
  },
  {
    id: "handoff-context",
    label: "Generate coding handoff",
    description: "Implementation context for Cursor or Claude Code.",
    appliesTo: [],
    task: "Produce implementation context for an engineer: the component tree to build, which design-system components map to which nodes, and the styles and variables involved. Do not invent values that are not in the payload.",
  },
];

export const DEFAULT_SYSTEM_PROMPT = [
  "You are analysing a Figma file that has been converted into a design graph.",
  "You only receive a bounded subgraph, never the whole file.",
  "Never invent nodes, components, styles or variables that are not in the payload.",
  "If the payload is insufficient, say exactly which node ids you would need next.",
].join(" ");

export function buildActionRequest(action: AiActionDefinition, context: AiGraphContext): LlmRequest {
  return {
    context,
    messages: [
      { role: "system", content: DEFAULT_SYSTEM_PROMPT },
      { role: "user", content: toMarkdownPrompt(context, action.task) },
    ],
  };
}

