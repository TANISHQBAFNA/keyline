import { useMemo, useState } from "react";
import { AI_ACTIONS, buildAiGraphContext, toJsonPayload, toMarkdownPrompt } from "@/core/ai";
import { useGraphStore } from "@/state/graphStore";

interface Props {
  nodeId: string;
  onClose: () => void;
}

/**
 * Phase 1 stops at the payload boundary on purpose: the app assembles a small,
 * inspectable subgraph and hands it over. Phase 4 wires the same payload into a
 * provider without changing anything below this component.
 */
export function AiContextPanel({ nodeId, onClose }: Props) {
  const index = useGraphStore((state) => state.index);
  const selectedIds = useGraphStore((state) => state.selectedIds);
  const viewMode = useGraphStore((state) => state.viewMode);

  const [actionId, setActionId] = useState(AI_ACTIONS[0]!.id);
  const [format, setFormat] = useState<"markdown" | "json">("markdown");
  const [budget, setBudget] = useState(60);
  const [copied, setCopied] = useState(false);

  const action = AI_ACTIONS.find((candidate) => candidate.id === actionId) ?? AI_ACTIONS[0]!;

  const context = useMemo(() => {
    if (!index) return undefined;
    return buildAiGraphContext(index, nodeId, {
      selectedNodeIds: selectedIds,
      viewMode,
      nodeBudget: budget,
    });
  }, [index, nodeId, selectedIds, viewMode, budget]);

  const payload = useMemo(() => {
    if (!context) return "";
    return format === "json" ? toJsonPayload(context) : toMarkdownPrompt(context, action.task);
  }, [context, format, action]);

  const bytes = new Blob([payload]).size;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="AI context">
      <div className="modal__panel">
        <header className="modal__header">
          <h2>AI context payload</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="modal__controls">
          <label>
            Action
            <select value={actionId} onChange={(event) => setActionId(event.target.value)}>
              {AI_ACTIONS.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Format
            <select
              value={format}
              onChange={(event) => setFormat(event.target.value as "markdown" | "json")}
            >
              <option value="markdown">Markdown prompt</option>
              <option value="json">JSON payload</option>
            </select>
          </label>
          <label>
            Node budget
            <input
              type="number"
              min={5}
              max={400}
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value) || 60)}
            />
          </label>
        </div>

        <p className="modal__summary">
          {context
            ? `${context.neighbors.length + 1} nodes · ${context.edges.length} edges · ${(
                bytes / 1024
              ).toFixed(1)} KB${context.meta.truncated ? " · truncated to budget" : ""}`
            : "No context available."}
        </p>
        <p className="modal__hint">{action.description}</p>

        <textarea className="modal__payload" readOnly value={payload} spellCheck={false} />

        <footer className="modal__footer">
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(payload);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1600);
            }}
          >
            {copied ? "Copied" : "Copy payload"}
          </button>
          <span className="muted">
            Paste into Claude, Cursor or any agent. No provider is called from this app yet.
          </span>
        </footer>
      </div>
    </div>
  );
}
