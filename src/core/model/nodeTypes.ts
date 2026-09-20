import { z } from "zod";

/**
 * Every Figma entity we care about becomes a graph node of one of these types.
 *
 * The list is deliberately source-agnostic: nothing here mentions a product
 * domain, a naming convention or a specific design system.
 */
export const NODE_TYPES = [
  // Structure
  "FILE",
  "PAGE",
  "SECTION",
  "FRAME",
  "AUTO_LAYOUT_CONTAINER",
  "GROUP",
  "LAYER",
  "TEXT_LAYER",
  "MEDIA_LAYER",
  // Component system
  "COMPONENT_SET",
  "MAIN_COMPONENT",
  "VARIANT",
  "COMPONENT_INSTANCE",
  // Foundations
  "STYLE",
  "VARIABLE",
  "VARIABLE_COLLECTION",
  "EXTERNAL_LIBRARY",
  // Interaction / meta
  "PROTOTYPE_INTERACTION",
  "ANNOTATION",
] as const;

export const NodeTypeSchema = z.enum(NODE_TYPES);
export type NodeType = z.infer<typeof NodeTypeSchema>;

/** Coarse semantic buckets. Drives colour, not decoration. */
export const NODE_CATEGORIES = [
  "STRUCTURE",
  "COMPONENT",
  "FOUNDATION",
  "INTERACTION",
] as const;
export type NodeCategory = (typeof NODE_CATEGORIES)[number];

export const NODE_CATEGORY_BY_TYPE: Record<NodeType, NodeCategory> = {
  FILE: "STRUCTURE",
  PAGE: "STRUCTURE",
  SECTION: "STRUCTURE",
  FRAME: "STRUCTURE",
  AUTO_LAYOUT_CONTAINER: "STRUCTURE",
  GROUP: "STRUCTURE",
  LAYER: "STRUCTURE",
  TEXT_LAYER: "STRUCTURE",
  MEDIA_LAYER: "STRUCTURE",
  COMPONENT_SET: "COMPONENT",
  MAIN_COMPONENT: "COMPONENT",
  VARIANT: "COMPONENT",
  COMPONENT_INSTANCE: "COMPONENT",
  STYLE: "FOUNDATION",
  VARIABLE: "FOUNDATION",
  VARIABLE_COLLECTION: "FOUNDATION",
  EXTERNAL_LIBRARY: "FOUNDATION",
  PROTOTYPE_INTERACTION: "INTERACTION",
  ANNOTATION: "INTERACTION",
};

/** Types that can hold structural children. */
export const CONTAINER_TYPES: readonly NodeType[] = [
  "FILE",
  "PAGE",
  "SECTION",
  "FRAME",
  "AUTO_LAYOUT_CONTAINER",
  "GROUP",
  "COMPONENT_SET",
  "MAIN_COMPONENT",
  "VARIANT",
  "COMPONENT_INSTANCE",
];

/** Types that behave like a "screen" in the product map. */
export const SCREEN_TYPES: readonly NodeType[] = ["FRAME", "AUTO_LAYOUT_CONTAINER"];

/** Types that define a reusable component. */
export const COMPONENT_DEFINITION_TYPES: readonly NodeType[] = [
  "COMPONENT_SET",
  "MAIN_COMPONENT",
  "VARIANT",
];

export function nodeCategory(type: NodeType): NodeCategory {
  return NODE_CATEGORY_BY_TYPE[type];
}
