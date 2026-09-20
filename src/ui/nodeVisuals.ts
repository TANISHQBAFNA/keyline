import { nodeCategory, type NodeCategory, type NodeType, type EdgeType } from "@/core/model";

/**
 * The visual grammar. Colour encodes semantic category, shape encodes the
 * node's role, and the glyph is a quick scanning aid — none of it is
 * decorative.
 */

export type NodeShape = "root" | "page" | "cluster" | "screen" | "container" | "leaf" | "family" | "component" | "reference" | "token";

export interface NodeVisual {
  glyph: string;
  shape: NodeShape;
  label: string;
}

export const NODE_VISUALS: Record<NodeType, NodeVisual> = {
  FILE: { glyph: "◈", shape: "root", label: "File" },
  PAGE: { glyph: "▤", shape: "page", label: "Page" },
  SECTION: { glyph: "▦", shape: "cluster", label: "Section" },
  FRAME: { glyph: "▢", shape: "screen", label: "Frame" },
  AUTO_LAYOUT_CONTAINER: { glyph: "≡", shape: "container", label: "Auto layout" },
  GROUP: { glyph: "⌸", shape: "container", label: "Group" },
  LAYER: { glyph: "◻", shape: "leaf", label: "Layer" },
  TEXT_LAYER: { glyph: "T", shape: "leaf", label: "Text" },
  MEDIA_LAYER: { glyph: "▨", shape: "leaf", label: "Media" },
  COMPONENT_SET: { glyph: "◆◆", shape: "family", label: "Component set" },
  MAIN_COMPONENT: { glyph: "◆", shape: "component", label: "Main component" },
  VARIANT: { glyph: "◇", shape: "component", label: "Variant" },
  COMPONENT_INSTANCE: { glyph: "◈", shape: "reference", label: "Instance" },
  STYLE: { glyph: "●", shape: "token", label: "Style" },
  VARIABLE: { glyph: "▪", shape: "token", label: "Variable" },
  VARIABLE_COLLECTION: { glyph: "▣", shape: "token", label: "Collection" },
  EXTERNAL_LIBRARY: { glyph: "⬡", shape: "token", label: "Library" },
  PROTOTYPE_INTERACTION: { glyph: "➤", shape: "leaf", label: "Interaction" },
  ANNOTATION: { glyph: "✎", shape: "leaf", label: "Annotation" },
};

export const CATEGORY_COLOR: Record<NodeCategory, string> = {
  STRUCTURE: "var(--cat-structure)",
  COMPONENT: "var(--cat-component)",
  FOUNDATION: "var(--cat-foundation)",
  INTERACTION: "var(--cat-interaction)",
};

export function colorForType(type: NodeType): string {
  return CATEGORY_COLOR[nodeCategory(type)];
}

export function visualForType(type: NodeType): NodeVisual {
  return NODE_VISUALS[type];
}

export interface EdgeVisual {
  stroke: string;
  dashed: boolean;
  animated: boolean;
  label: string;
}

export const EDGE_VISUALS: Record<EdgeType, EdgeVisual> = {
  CONTAINS: { stroke: "var(--edge-structure)", dashed: false, animated: false, label: "contains" },
  PARENT_OF: { stroke: "var(--edge-structure)", dashed: true, animated: false, label: "parent" },
  INSTANCE_OF: { stroke: "var(--edge-component)", dashed: false, animated: false, label: "instance of" },
  USED_IN: { stroke: "var(--edge-component)", dashed: true, animated: false, label: "used in" },
  VARIANT_OF: { stroke: "var(--edge-component)", dashed: true, animated: false, label: "variant of" },
  NESTS: { stroke: "var(--edge-component)", dashed: true, animated: false, label: "nests" },
  USES_STYLE: { stroke: "var(--edge-foundation)", dashed: true, animated: false, label: "style" },
  USES_VARIABLE: { stroke: "var(--edge-foundation)", dashed: true, animated: false, label: "variable" },
  BELONGS_TO_COLLECTION: { stroke: "var(--edge-foundation)", dashed: false, animated: false, label: "in collection" },
  SOURCED_FROM_LIBRARY: { stroke: "var(--edge-foundation)", dashed: true, animated: false, label: "library" },
  PROTOTYPES_TO: { stroke: "var(--edge-interaction)", dashed: false, animated: true, label: "navigates to" },
  LINKS_TO: { stroke: "var(--edge-interaction)", dashed: true, animated: false, label: "links to" },
  GOVERNS: { stroke: "var(--edge-structure)", dashed: true, animated: false, label: "governs" },
};
