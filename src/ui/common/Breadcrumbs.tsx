import { useGraphStore } from "@/state/graphStore";
import { visualForType } from "@/ui/nodeVisuals";

export function Breadcrumbs() {
  const index = useGraphStore((state) => state.index);
  const focusId = useGraphStore((state) => state.focusId);
  const focusNode = useGraphStore((state) => state.focusNode);

  if (!index || !focusId) return null;
  const path = index.getHierarchyPath(focusId);
  const focus = index.getNode(focusId);
  const main = focus?.mainComponentId ? index.getNode(focus.mainComponentId) : undefined;

  return (
    <nav className="breadcrumbs" aria-label="Hierarchy path">
      {path.map((node, i) => (
        <span key={node.id} className="breadcrumbs__item">
          {i > 0 && <span className="breadcrumbs__sep">›</span>}
          <button
            type="button"
            className={`breadcrumbs__link${node.id === focusId ? " is-current" : ""}`}
            onClick={() => focusNode(node.id)}
            title={visualForType(node.type).label}
          >
            <span aria-hidden="true">{visualForType(node.type).glyph}</span> {node.name}
          </button>
        </span>
      ))}
      {main && (
        <span className="breadcrumbs__item">
          <span className="breadcrumbs__sep">→</span>
          <button
            type="button"
            className="breadcrumbs__link breadcrumbs__link--jump"
            onClick={() => focusNode(main.id)}
            title="Main component"
          >
            <span aria-hidden="true">{visualForType(main.type).glyph}</span> {main.name}
          </button>
        </span>
      )}
    </nav>
  );
}
