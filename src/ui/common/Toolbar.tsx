import { GRAPH_LEVELS, VIEW_MODES, type GraphLevel, type ViewMode } from "@/core/query";
import { useGraphStore } from "@/state/graphStore";
import { useSubgraph } from "@/state/selectors";

const VIEW_LABELS: Record<ViewMode, string> = {
  hierarchy: "Hierarchy",
  dependency: "Dependency",
  usage: "Usage",
  prototype: "Prototype flow",
};

const LEVEL_LABELS: Record<GraphLevel, string> = {
  PRODUCT_MAP: "L1 · Product map",
  PAGE_MAP: "L2 · Page map",
  FRAME_COMPOSITION: "L3 · Frame composition",
  COMPONENT_DEPENDENCY: "L4 · Component dependencies",
};

export function Toolbar() {
  const viewMode = useGraphStore((state) => state.viewMode);
  const setViewMode = useGraphStore((state) => state.setViewMode);
  const level = useGraphStore((state) => state.level);
  const setLevel = useGraphStore((state) => state.setLevel);
  const goBack = useGraphStore((state) => state.goBack);
  const goForward = useGraphStore((state) => state.goForward);
  const canGoBack = useGraphStore((state) => state.past.length > 0);
  const canGoForward = useGraphStore((state) => state.future.length > 0);
  const collapseAll = useGraphStore((state) => state.collapseAll);
  const expandedCount = useGraphStore((state) => state.expandedIds.length);
  const subgraph = useSubgraph();

  return (
    <div className="toolbar">
      <div className="toolbar__group">
        <button type="button" onClick={goBack} disabled={!canGoBack} title="Back">
          ←
        </button>
        <button type="button" onClick={goForward} disabled={!canGoForward} title="Forward">
          →
        </button>
      </div>

      <div className="toolbar__group toolbar__tabs" role="tablist" aria-label="View mode">
        {VIEW_MODES.map((mode) => (
          <button
            key={mode}
            type="button"
            role="tab"
            aria-selected={mode === viewMode}
            className={mode === viewMode ? "is-active" : ""}
            onClick={() => setViewMode(mode)}
          >
            {VIEW_LABELS[mode]}
          </button>
        ))}
      </div>

      <div className="toolbar__group">
        <label className="toolbar__label" htmlFor="level-select">
          Level
        </label>
        <select
          id="level-select"
          value={level}
          onChange={(event) => setLevel(event.target.value as GraphLevel | "auto")}
        >
          <option value="auto">Auto (follows selection)</option>
          {GRAPH_LEVELS.map((candidate) => (
            <option key={candidate} value={candidate}>
              {LEVEL_LABELS[candidate]}
            </option>
          ))}
        </select>
      </div>

      <div className="toolbar__group toolbar__status">
        {subgraph && (
          <span>
            {subgraph.nodes.length} nodes · {subgraph.edges.length} edges
            {subgraph.hiddenCount > 0 && (
              <span className="toolbar__muted"> · {subgraph.hiddenCount} hidden</span>
            )}
          </span>
        )}
        {expandedCount > 0 && (
          <button type="button" onClick={collapseAll} title="Collapse manual expansions">
            Collapse ({expandedCount})
          </button>
        )}
      </div>
    </div>
  );
}
