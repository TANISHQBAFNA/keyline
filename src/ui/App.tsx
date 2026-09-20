import { useEffect, useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { DEFAULT_SOURCE, SOURCE_OPTIONS, resolveSource } from "@/state/sources";
import { useGraphStore } from "@/state/graphStore";
import { Breadcrumbs } from "@/ui/common/Breadcrumbs";
import { Toolbar } from "@/ui/common/Toolbar";
import { GraphCanvas } from "@/ui/graph/GraphCanvas";
import { AtlasCanvas } from "@/ui/graph/AtlasCanvas";
import { Legend } from "@/ui/graph/Legend";
import { SearchBar } from "@/ui/panels/SearchBar";
import { FilterPanel } from "@/ui/panels/FilterPanel";
import { NodeBrowser } from "@/ui/panels/NodeBrowser";
import { Inspector } from "@/ui/panels/Inspector";
import { CommunityPanel } from "@/ui/panels/CommunityPanel";
import { ExportMenu } from "@/ui/panels/ExportMenu";
import { ImportButton } from "@/ui/panels/ImportButton";
import { FigmaRestButton } from "@/ui/panels/FigmaRestButton";

export function App() {
  const status = useGraphStore((state) => state.status);
  const error = useGraphStore((state) => state.error);
  const graph = useGraphStore((state) => state.graph);
  const analytics = useGraphStore((state) => state.analytics);
  const loadSource = useGraphStore((state) => state.loadSource);
  const mode = useGraphStore((state) => state.mode);
  const setMode = useGraphStore((state) => state.setMode);
  const [showWarnings, setShowWarnings] = useState(false);
  const [sourceId, setSourceId] = useState(DEFAULT_SOURCE.id);

  useEffect(() => {
    void loadSource(DEFAULT_SOURCE);
  }, [loadSource]);

  return (
    <div className="app">
      <header className="app__bar">
        <div className="app__brand">
          <span className="app__logo" aria-hidden="true">
            ◈
          </span>
          <div>
            <h1>Figma Graphify</h1>
            <p>{graph ? graph.fileName : "Design graph explorer"}</p>
          </div>
        </div>

        <div className="app__modes" role="tablist" aria-label="View">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "atlas"}
            className={mode === "atlas" ? "is-active" : ""}
            onClick={() => setMode("atlas")}
          >
            Atlas
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "explorer"}
            className={mode === "explorer" ? "is-active" : ""}
            onClick={() => setMode("explorer")}
          >
            Explorer
          </button>
        </div>

        <label className="app__source-picker">
          <span className="visually-hidden">Data source</span>
          <select
            value={sourceId}
            onChange={(event) => {
              const id = event.target.value;
              setSourceId(id);
              void resolveSource(id).then(loadSource);
            }}
          >
            {SOURCE_OPTIONS.map((source) => (
              <option key={source.id} value={source.id}>
                {source.label}
              </option>
            ))}
          </select>
        </label>

        {graph && analytics && (
          <div className="app__stats">
            <span>{analytics.totals.frames} frames</span>
            <span>{analytics.totals.componentDefinitions} components</span>
            <span>{analytics.totals.instances} instances</span>
            <span className="app__source">source: {graph.source.kind}</span>
          </div>
        )}

        <div className="app__bar-right">
          <FigmaRestButton />
          <ImportButton />
          <ExportMenu />
          {graph && graph.warnings.length > 0 && (
            <button
              type="button"
              className="app__warnings"
              onClick={() => setShowWarnings((value) => !value)}
            >
              {graph.warnings.length} data warnings
            </button>
          )}
        </div>
      </header>

      {showWarnings && graph && (
        <div className="app__warning-list">
          <ul>
            {graph.warnings.map((warning, i) => (
              <li key={`${warning.code}-${i}`}>
                <code>{warning.code}</code> {warning.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === "loading" && <div className="app__state">Building graph…</div>}
      {status === "error" && <div className="app__state app__state--error">{error}</div>}

      {status === "ready" && (
        <div className="app__body">
          <aside className="app__left">
            <SearchBar />
            {mode === "explorer" && <FilterPanel />}
            <NodeBrowser />
          </aside>

          <main className="app__center">
            {mode === "explorer" ? (
              <>
                <Breadcrumbs />
                <Toolbar />
                <div className="app__canvas">
                  <ReactFlowProvider>
                    <GraphCanvas />
                  </ReactFlowProvider>
                  <Legend />
                </div>
              </>
            ) : (
              <div className="app__canvas">
                <AtlasCanvas />
              </div>
            )}
          </main>

          <aside className="app__right">
            {mode === "atlas" && <CommunityPanel />}
            <Inspector />
          </aside>
        </div>
      )}
    </div>
  );
}
