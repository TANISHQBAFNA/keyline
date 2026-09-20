import type { NodeType } from "@/core/model";
import type { SourceNode } from "@/core/ingestion/types";

/**
 * Maps a raw Figma node type onto a semantic graph node type.
 *
 * Every rule here is structural. Nothing depends on layer names, so the
 * classifier behaves identically for any file, any team and any design system.
 */

export interface ClassifyContext {
  /** Raw Figma type of the parent node, if any. */
  parentSourceType?: string;
  /** Graph type of the parent node, if any. */
  parentGraphType?: NodeType;
}

export interface ClassifyOptions {
  /**
   * When true (default) a *nested* frame that uses auto layout is typed
   * `AUTO_LAYOUT_CONTAINER` instead of `FRAME`, so screens stay visually
   * distinct from the layout scaffolding inside them. Top-level frames (direct
   * children of a page or section) are always `FRAME` — they are the screens.
   */
  classifyAutoLayout?: boolean;
}

const MEDIA_SOURCE_TYPES = new Set(["IMAGE", "VIDEO", "MEDIA"]);

const VECTOR_SOURCE_TYPES = new Set([
  "RECTANGLE",
  "ELLIPSE",
  "LINE",
  "VECTOR",
  "STAR",
  "POLYGON",
  "BOOLEAN_OPERATION",
  "SLICE",
  "WASHI_TAPE",
  "TABLE",
  "TABLE_CELL",
  "CONNECTOR",
  "SHAPE_WITH_TEXT",
  "STICKY",
  "WIDGET",
  "EMBED",
  "LINK_UNFURL",
]);

export function classifySourceNode(
  node: SourceNode,
  context: ClassifyContext = {},
  options: ClassifyOptions = {},
): NodeType {
  const classifyAutoLayout = options.classifyAutoLayout ?? true;

  switch (node.type) {
    case "DOCUMENT":
      return "FILE";
    case "CANVAS":
    case "PAGE":
      return "PAGE";
    case "SECTION":
      return "SECTION";
    case "COMPONENT_SET":
      return "COMPONENT_SET";
    case "COMPONENT":
      return context.parentSourceType === "COMPONENT_SET" ? "VARIANT" : "MAIN_COMPONENT";
    case "INSTANCE":
      return "COMPONENT_INSTANCE";
    case "GROUP":
    // A Figma slot is a content container inside a component; structurally it
    // behaves like a group.
    case "SLOT":
      return "GROUP";
    case "TEXT":
      return "TEXT_LAYER";
    case "FRAME":
    case "COMPONENT_FRAME": {
      // A screen is a frame whose parent is not itself a layout container.
      // `FILE` matters for subtree sources (MCP, a plugin selection export):
      // there are no pages, so the captured frame hangs straight off the root
      // and must still count as a screen.
      const isScreen =
        context.parentGraphType === "PAGE" ||
        context.parentGraphType === "SECTION" ||
        context.parentGraphType === "FILE" ||
        context.parentGraphType === undefined;
      if (!isScreen && classifyAutoLayout && node.layoutMode && node.layoutMode !== "NONE") {
        return "AUTO_LAYOUT_CONTAINER";
      }
      return "FRAME";
    }
    default:
      break;
  }

  if (node.hasImageFill || MEDIA_SOURCE_TYPES.has(node.type)) return "MEDIA_LAYER";
  if (VECTOR_SOURCE_TYPES.has(node.type)) return "LAYER";
  return "LAYER";
}

/** Style ids from Figma are opaque; the slot name tells us the style kind. */
export function styleKindFromSlot(slot: string): string {
  const base = slot.replace(/\[\d+\]$/, "").toLowerCase();
  if (base.startsWith("fill")) return "FILL";
  if (base.startsWith("stroke")) return "STROKE";
  if (base.startsWith("text")) return "TEXT";
  if (base.startsWith("effect")) return "EFFECT";
  if (base.startsWith("grid")) return "GRID";
  return base.toUpperCase();
}
