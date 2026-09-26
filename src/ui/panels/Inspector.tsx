import { useState, type ReactNode } from "react";
import type { GraphNode } from "@/core/model";
import { computeComponentUsage, usageSummaryFor } from "@/core/query";
import { useGraphStore } from "@/state/graphStore";
import { visualForType } from "@/ui/nodeVisuals";
import { safeHref } from "@/ui/safeHref";
import { AiContextPanel } from "./AiContextPanel";

function NodeLink({ node }: { node: GraphNode }) {
  const focusNode = useGraphStore((state) => state.focusNode);
  const visual = visualForType(node.type);
  return (
    <button type="button" className="node-link" onClick={() => focusNode(node.id)}>
      <span className={`node-link__glyph cat-${node.type}`} aria-hidden="true">
        {visual.glyph}
      </span>
      <span className="node-link__name">{node.name}</span>
      <span className="node-link__type">{visual.label}</span>
    </button>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="kv">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

const copy = (value: string) => {
  void navigator.clipboard?.writeText(value);
};

export function Inspector() {
  const index = useGraphStore((state) => state.index);
  const graph = useGraphStore((state) => state.graph);
  const focusId = useGraphStore((state) => state.focusId);
  const selectedIds = useGraphStore((state) => state.selectedIds);
  const focusNode = useGraphStore((state) => state.focusNode);
  const [aiOpen, setAiOpen] = useState(false);

  const inspectedId = selectedIds[selectedIds.length - 1] ?? focusId;
  const node = index && inspectedId ? index.getNode(inspectedId) : undefined;

  if (!index || !graph || !node) {
    return (
      <aside className="inspector">
        <p className="panel__empty">
          Select a cluster or node. Overview shows library health until you pick one.
        </p>
      </aside>
    );
  }

  const visual = visualForType(node.type);
  const summary = usageSummaryFor(index, node.id);
  const children = index.getChildren(node.id);
  const main = node.mainComponentId ? index.getNode(node.mainComponentId) : undefined;
  const componentSet = node.componentSetId ? index.getNode(node.componentSetId) : undefined;
  const variants = index.getVariantsOf(node.id);
  const instances = node.isMainComponent || node.type === "COMPONENT_SET" ? index.getAllInstancesOf(node.id) : [];
  const styles = index.getNodes(node.styleIds ?? []);
  const variables = index.getNodes(node.variableIds ?? []);
  const page = node.pageId ? index.getNode(node.pageId) : undefined;
  const section = node.sectionId ? index.getNode(node.sectionId) : undefined;
  const frame = index.getContainingFrame(node.id);
  const library = node.libraryId ? index.getNode(node.libraryId) : undefined;
  const outgoingProto = index.getEdges(node.id, { direction: "out", edgeTypes: ["PROTOTYPES_TO"] });
  const incomingProto = index.getEdges(node.id, { direction: "in", edgeTypes: ["PROTOTYPES_TO"] });
  const links = index.getEdges(node.id, { direction: "out", edgeTypes: ["LINKS_TO"] });
  const externalLinks = (node.metadata?.["externalLinks"] as Array<{ url: string }> | undefined) ?? [];
  const annotations =
    (node.metadata?.["annotations"] as Array<{ label: string }> | undefined) ?? [];
  const isMock = graph.source.kind === "mock";
  const revealHref = node.figmaUrl ? safeHref(node.figmaUrl) : undefined;
  const usage =
    node.isMainComponent || node.type === "COMPONENT_SET"
      ? computeComponentUsage(index, node)
      : undefined;

  /**
   * Group usages by page when the source gave us pages, and by the outermost
   * frame — the screen — when it did not. An MCP capture has no page context,
   * and a flat list of eleven identical names answers nothing.
   */
  const groupFor = (instance: GraphNode): GraphNode | undefined => {
    if (instance.pageId) return index.getNode(instance.pageId);
    return index.getHierarchyPath(instance.id).find((ancestor) => ancestor.type === "FRAME");
  };

  const instancesByContainer = new Map<string, { container?: GraphNode; nodes: GraphNode[] }>();
  for (const instance of instances) {
    const container = groupFor(instance);
    const key = container?.id ?? "unknown";
    const bucket = instancesByContainer.get(key);
    if (bucket) bucket.nodes.push(instance);
    else instancesByContainer.set(key, { container, nodes: [instance] });
  }

  return (
    <aside className="inspector">
      <header className="inspector__header">
        <span className={`inspector__glyph cat-${node.type}`} aria-hidden="true">
          {visual.glyph}
        </span>
        <div>
          <h2>{node.name}</h2>
          <p className="inspector__type">
            {visual.label}
            {node.isRemote && <span className="chip chip--remote">library</span>}
            {node.isInstance && !node.mainComponentId && (
              <span className="chip chip--warn">unresolved main</span>
            )}
            {node.status && (
              <span className={node.status === "deprecated" ? "chip chip--warn" : "chip"}>
                {node.status}
              </span>
            )}
            {node.metadata?.["identity"] === "inferred-from-name" && (
              <span className="chip chip--warn" title="Identity inferred from instance names — this source does not expose componentId">
                name-matched
              </span>
            )}
          </p>
        </div>
      </header>

      {node.description && <p className="inspector__description">{node.description}</p>}

      <div className="inspector__actions">
        {node.id !== focusId && (
          <button type="button" onClick={() => focusNode(node.id)}>
            Explore from here
          </button>
        )}
        {revealHref && (
          <a
            className="button"
            href={revealHref}
            target="_blank"
            rel="noreferrer noopener"
            title={isMock ? "Mock file — this link is illustrative" : "Open in Figma"}
          >
            Reveal in Figma{isMock ? " (mock)" : ""}
          </a>
        )}
        {node.figmaUrl && (
          <button type="button" onClick={() => copy(node.figmaUrl!)} title="Copy deep link">
            Copy link
          </button>
        )}
        <button type="button" onClick={() => setAiOpen(true)}>
          AI context…
        </button>
      </div>

      <dl className="inspector__section">
        <Row
          label="Figma node id"
          value={
            node.figmaNodeId ? (
              <button className="mono-link" type="button" onClick={() => copy(node.figmaNodeId!)}>
                {node.figmaNodeId}
              </button>
            ) : (
              <span className="muted">n/a</span>
            )
          }
        />
        <Row label="Graph id" value={<code>{node.id}</code>} />
        {page && <Row label="Page" value={<NodeLink node={page} />} />}
        {section && <Row label="Section" value={<NodeLink node={section} />} />}
        {frame && frame.id !== node.id && <Row label="Frame" value={<NodeLink node={frame} />} />}
        {library && <Row label="Library" value={<NodeLink node={library} />} />}
        <Row label="Children" value={summary.directChildrenCount ?? 0} />
        {summary.instanceCount !== undefined && (
          <Row label="Usages" value={summary.instanceCount} />
        )}
        {usage && <Row label="Frames affected" value={usage.frameIds.length} />}
        {usage && <Row label="Pages affected" value={usage.pageIds.length} />}
        {usage && <Row label="Risk score" value={usage.riskScore} />}
        {node.bounds && (
          <Row
            label="Size"
            value={`${Math.round(node.bounds.width)} × ${Math.round(node.bounds.height)}`}
          />
        )}
      </dl>

      {node.variantProperties && (
        <section className="inspector__section">
          <h3>Variant properties</h3>
          <dl className="kv-list">
            {Object.entries(node.variantProperties).map(([key, value]) => (
              <Row key={key} label={key} value={value} />
            ))}
          </dl>
        </section>
      )}

      {(main || componentSet) && (
        <section className="inspector__section">
          <h3>Component definition</h3>
          {main && <NodeLink node={main} />}
          {componentSet && <NodeLink node={componentSet} />}
        </section>
      )}

      {variants.length > 0 && (
        <section className="inspector__section">
          <h3>Variants ({variants.length})</h3>
          {variants.map((variant) => (
            <NodeLink key={variant.id} node={variant} />
          ))}
        </section>
      )}

      {instances.length > 0 && (
        <section className="inspector__section">
          <h3>Instances ({instances.length})</h3>
          {[...instancesByContainer.entries()].map(([key, group]) => (
            <div key={key} className="inspector__cluster">
              {group.container && (
                <h4>
                  {group.container.name}
                  <span className="inspector__cluster-count">{group.nodes.length}</span>
                </h4>
              )}
              {group.nodes.map((instance) => (
                <NodeLink key={instance.id} node={instance} />
              ))}
            </div>
          ))}
        </section>
      )}

      {children.length > 0 && (
        <section className="inspector__section">
          <h3>Direct children ({children.length})</h3>
          {children.slice(0, 12).map((child) => (
            <NodeLink key={child.id} node={child} />
          ))}
          {children.length > 12 && (
            <p className="muted">+{children.length - 12} more — expand the node on the canvas.</p>
          )}
        </section>
      )}

      {(styles.length > 0 || variables.length > 0) && (
        <section className="inspector__section">
          <h3>Foundations</h3>
          {styles.map((style) => (
            <NodeLink key={style.id} node={style} />
          ))}
          {variables.map((variable) => (
            <NodeLink key={variable.id} node={variable} />
          ))}
        </section>
      )}

      {(outgoingProto.length > 0 || incomingProto.length > 0) && (
        <section className="inspector__section">
          <h3>Prototype</h3>
          {outgoingProto.map((edge) => {
            const target = index.getNode(edge.target);
            return target ? (
              <div key={edge.id} className="inspector__flow">
                <span className="muted">→ {String(edge.metadata?.["trigger"] ?? "navigate")}</span>
                <NodeLink node={target} />
              </div>
            ) : null;
          })}
          {incomingProto.map((edge) => {
            const source = index.getNode(edge.source);
            return source ? (
              <div key={edge.id} className="inspector__flow">
                <span className="muted">← from</span>
                <NodeLink node={source} />
              </div>
            ) : null;
          })}
        </section>
      )}

      {(links.length > 0 || externalLinks.length > 0) && (
        <section className="inspector__section">
          <h3>Links</h3>
          {links.map((edge) => {
            const target = index.getNode(edge.target);
            return target ? <NodeLink key={edge.id} node={target} /> : null;
          })}
          {externalLinks.map((link) => {
            const href = safeHref(link.url);
            return href ? (
              <a key={link.url} href={href} target="_blank" rel="noreferrer noopener">
                {link.url}
              </a>
            ) : (
              <span key={link.url}>{link.url}</span>
            );
          })}
        </section>
      )}

      {annotations.length > 0 && (
        <section className="inspector__section">
          <h3>Annotations</h3>
          {annotations.map((annotation, i) => (
            <p key={i} className="inspector__annotation">
              {annotation.label}
            </p>
          ))}
        </section>
      )}

      <details className="inspector__raw">
        <summary>Raw metadata</summary>
        <pre>{JSON.stringify(node.metadata ?? {}, null, 2)}</pre>
      </details>

      {aiOpen && <AiContextPanel nodeId={node.id} onClose={() => setAiOpen(false)} />}
    </aside>
  );
}
