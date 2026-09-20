import { useState } from "react";
import { NODE_CATEGORIES, type NodeCategory } from "@/core/model";
import { EDGE_VISUALS } from "@/ui/nodeVisuals";

const CATEGORY_LABEL: Record<NodeCategory, string> = {
  STRUCTURE: "Structure — file, pages, sections, frames, layers",
  COMPONENT: "Component system — sets, main components, variants, instances",
  FOUNDATION: "Foundations — styles, variables, collections, libraries",
  INTERACTION: "Interaction — prototype links, annotations",
};

const EDGE_KEYS = ["CONTAINS", "INSTANCE_OF", "USES_VARIABLE", "PROTOTYPES_TO"] as const;

export function Legend() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`legend${open ? " is-open" : ""}`}>
      <button type="button" onClick={() => setOpen((value) => !value)}>
        Legend {open ? "▾" : "▸"}
      </button>
      {open && (
        <div className="legend__body">
          <ul>
            {NODE_CATEGORIES.map((category) => (
              <li key={category}>
                <span
                  className="legend__swatch"
                  style={{ background: `var(--cat-${category.toLowerCase()})` }}
                />
                {CATEGORY_LABEL[category]}
              </li>
            ))}
          </ul>
          <ul>
            {EDGE_KEYS.map((key) => (
              <li key={key}>
                <span
                  className="legend__line"
                  style={{
                    background: EDGE_VISUALS[key].stroke,
                    opacity: EDGE_VISUALS[key].dashed ? 0.55 : 1,
                  }}
                />
                {key}
              </li>
            ))}
          </ul>
          <p className="legend__hint">
            Click a node to inspect · shift-click to re-root · double-click to expand children ·
            ⌘/ctrl-click to multi-select
          </p>
        </div>
      )}
    </div>
  );
}
