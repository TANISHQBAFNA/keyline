import { z } from "zod";

export const EDGE_TYPES = [
  // Structural
  "CONTAINS",
  "PARENT_OF",
  // Component system
  "INSTANCE_OF",
  "USED_IN",
  "VARIANT_OF",
  "NESTS",
  // Design system
  "USES_STYLE",
  "USES_VARIABLE",
  "BELONGS_TO_COLLECTION",
  "SOURCED_FROM_LIBRARY",
  // Interaction
  "PROTOTYPES_TO",
  "LINKS_TO",
  "GOVERNS",
] as const;

export const EdgeTypeSchema = z.enum(EDGE_TYPES);
export type EdgeType = z.infer<typeof EdgeTypeSchema>;

/**
 * `PARENT_OF` and `USED_IN` are materialised inverses of `CONTAINS` and
 * `INSTANCE_OF`. They exist so traversal and AI payloads can be direction
 * agnostic, but they are hidden from the canvas by default so the user never
 * sees the same relationship drawn twice.
 */
export const DERIVED_EDGE_TYPES: readonly EdgeType[] = ["PARENT_OF", "USED_IN"];

export const INVERSE_EDGE_TYPE: Partial<Record<EdgeType, EdgeType>> = {
  CONTAINS: "PARENT_OF",
  PARENT_OF: "CONTAINS",
  INSTANCE_OF: "USED_IN",
  USED_IN: "INSTANCE_OF",
};

export const HIERARCHY_EDGE_TYPES: readonly EdgeType[] = ["CONTAINS"];

export const DEPENDENCY_EDGE_TYPES: readonly EdgeType[] = [
  "INSTANCE_OF",
  "VARIANT_OF",
  "NESTS",
  "USES_STYLE",
  "USES_VARIABLE",
  "BELONGS_TO_COLLECTION",
  "SOURCED_FROM_LIBRARY",
  "GOVERNS",
];

export const USAGE_EDGE_TYPES: readonly EdgeType[] = ["USED_IN", "VARIANT_OF", "NESTS"];

export const PROTOTYPE_EDGE_TYPES: readonly EdgeType[] = ["PROTOTYPES_TO", "LINKS_TO"];

export function isDerivedEdgeType(type: EdgeType): boolean {
  return DERIVED_EDGE_TYPES.includes(type);
}
