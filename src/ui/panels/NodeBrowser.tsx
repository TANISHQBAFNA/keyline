import { useGraphStore } from "@/state/graphStore";
import { useBrowserResults } from "@/state/selectors";
import { visualForType } from "@/ui/nodeVisuals";

export function NodeBrowser() {
  const index = useGraphStore((state) => state.index);
  const focusId = useGraphStore((state) => state.focusId);
  const focusNode = useGraphStore((state) => state.focusNode);
  const { results, total } = useBrowserResults();

  if (!index) return null;

  return (
    <section className="browser" aria-label="Node browser">
      <header className="panel__header">
        <h2>Nodes</h2>
        <span className="panel__count">
          {results.length}
          {total > results.length ? ` of ${total}` : ""}
        </span>
      </header>
      {results.length === 0 && <p className="panel__empty">No nodes match this query.</p>}
      <ul className="browser__list">
        {results.map(({ node, matchedOn }) => {
          const visual = visualForType(node.type);
          const page = node.pageId ? index.getNode(node.pageId) : undefined;
          return (
            <li key={node.id}>
              <button
                type="button"
                className={`browser__row${node.id === focusId ? " is-current" : ""}`}
                onClick={() => focusNode(node.id)}
              >
                <span className={`browser__glyph cat-${node.type}`} aria-hidden="true">
                  {visual.glyph}
                </span>
                <span className="browser__text">
                  <span className="browser__name">{node.name}</span>
                  <span className="browser__meta">
                    {visual.label}
                    {page && node.type !== "PAGE" ? ` · ${page.name}` : ""}
                    {node.isRemote ? " · library" : ""}
                  </span>
                </span>
                {matchedOn.length > 0 && (
                  <span className="browser__match" title={matchedOn.join(", ")}>
                    {matchedOn[0]}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
