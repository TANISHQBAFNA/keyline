import { useState } from "react";
import { NODE_TYPES, nodeCategory, type NodeType } from "@/core/model";
import { useGraphStore } from "@/state/graphStore";
import { visualForType } from "@/ui/nodeVisuals";

const CATEGORY_ORDER = ["STRUCTURE", "COMPONENT", "FOUNDATION", "INTERACTION"] as const;

const CATEGORY_LABEL: Record<(typeof CATEGORY_ORDER)[number], string> = {
  STRUCTURE: "Structure",
  COMPONENT: "Component system",
  FOUNDATION: "Foundations",
  INTERACTION: "Interaction",
};

export function FilterPanel() {
  const index = useGraphStore((state) => state.index);
  const filters = useGraphStore((state) => state.filters);
  const setFilters = useGraphStore((state) => state.setFilters);
  const toggleNodeTypeFilter = useGraphStore((state) => state.toggleNodeTypeFilter);
  const resetFilters = useGraphStore((state) => state.resetFilters);
  const [open, setOpen] = useState(true);

  if (!index) return null;
  const pages = index.getPages();
  const libraries = index.getNodesByType("EXTERNAL_LIBRARY");

  const activeCount =
    filters.nodeTypes.length +
    filters.pageIds.length +
    filters.libraryIds.length +
    (filters.componentScope !== "all" ? 1 : 0) +
    (filters.origin !== "all" ? 1 : 0) +
    [
      filters.onlyUnusedComponents,
      filters.onlyUnresolvedInstances,
      filters.onlyFramesWithoutComponents,
      filters.onlyPrototypeLinked,
      filters.onlyDesignSystemConsumers,
      filters.hideHiddenLayers,
    ].filter(Boolean).length;

  return (
    <section className="filters" aria-label="Filters">
      <header className="panel__header">
        <button type="button" className="panel__toggle" onClick={() => setOpen((v) => !v)}>
          <h2>Filters{activeCount > 0 ? ` (${activeCount})` : ""}</h2>
          <span aria-hidden="true">{open ? "▾" : "▸"}</span>
        </button>
        {activeCount > 0 && (
          <button type="button" className="panel__reset" onClick={resetFilters}>
            Reset
          </button>
        )}
      </header>

      {open && (
        <div className="filters__body">
          {CATEGORY_ORDER.map((category) => {
            const types = NODE_TYPES.filter((type) => nodeCategory(type) === category);
            return (
              <div className="filters__group" key={category}>
                <h3>{CATEGORY_LABEL[category]}</h3>
                <div className="filters__chips">
                  {types.map((type: NodeType) => (
                    <button
                      key={type}
                      type="button"
                      className={`chip chip--toggle cat-${type}${
                        filters.nodeTypes.includes(type) ? " is-on" : ""
                      }`}
                      onClick={() => toggleNodeTypeFilter(type)}
                    >
                      <span aria-hidden="true">{visualForType(type).glyph}</span>{" "}
                      {visualForType(type).label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {pages.length > 0 && (
          <div className="filters__group">
            <h3>Page</h3>
            <select
              multiple
              aria-label="Filter by page"
              size={Math.min(5, Math.max(2, pages.length))}
              value={filters.pageIds}
              onChange={(event) =>
                setFilters({
                  pageIds: [...event.target.selectedOptions].map((option) => option.value),
                })
              }
            >
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </select>
          </div>
          )}

          {libraries.length > 0 && (
            <div className="filters__group">
              <h3>Library</h3>
              <select
                multiple
                aria-label="Filter by library"
                size={Math.min(4, Math.max(2, libraries.length))}
                value={filters.libraryIds}
                onChange={(event) =>
                  setFilters({
                    libraryIds: [...event.target.selectedOptions].map((option) => option.value),
                  })
                }
              >
                {libraries.map((library) => (
                  <option key={library.id} value={library.id}>
                    {library.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="filters__group">
            <h3>Component scope</h3>
            <div className="filters__chips">
              {(["all", "main", "instance"] as const).map((scope) => (
                <button
                  key={scope}
                  type="button"
                  className={`chip chip--toggle${filters.componentScope === scope ? " is-on" : ""}`}
                  onClick={() => setFilters({ componentScope: scope })}
                >
                  {scope === "all" ? "All" : scope === "main" ? "Main components" : "Instances"}
                </button>
              ))}
            </div>
          </div>

          <div className="filters__group">
            <h3>Origin</h3>
            <div className="filters__chips">
              {(["all", "local", "remote"] as const).map((origin) => (
                <button
                  key={origin}
                  type="button"
                  className={`chip chip--toggle${filters.origin === origin ? " is-on" : ""}`}
                  onClick={() => setFilters({ origin })}
                >
                  {origin === "all" ? "All" : origin === "local" ? "Local" : "Library"}
                </button>
              ))}
            </div>
          </div>

          <div className="filters__group">
            <h3>Health</h3>
            <label>
              <input
                type="checkbox"
                checked={filters.onlyUnusedComponents}
                onChange={(event) => setFilters({ onlyUnusedComponents: event.target.checked })}
              />
              Components with no instances
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.onlyUnresolvedInstances}
                onChange={(event) => setFilters({ onlyUnresolvedInstances: event.target.checked })}
              />
              Instances with unresolved main
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.onlyFramesWithoutComponents}
                onChange={(event) =>
                  setFilters({ onlyFramesWithoutComponents: event.target.checked })
                }
              />
              Frames with no component usage
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.onlyPrototypeLinked}
                onChange={(event) => setFilters({ onlyPrototypeLinked: event.target.checked })}
              />
              Prototype-linked only
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.onlyDesignSystemConsumers}
                onChange={(event) =>
                  setFilters({ onlyDesignSystemConsumers: event.target.checked })
                }
              />
              Uses a style or variable
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.hideHiddenLayers}
                onChange={(event) => setFilters({ hideHiddenLayers: event.target.checked })}
              />
              Hide hidden layers
            </label>
          </div>
        </div>
      )}
    </section>
  );
}
