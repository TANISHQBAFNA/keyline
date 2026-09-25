import { useState } from "react";
import { useGraphStore } from "@/state/graphStore";
import { useAtlas } from "@/state/selectors";
import { HealthChip } from "./Stat";
import { libraryHealth } from "./health";

export const AGENT_HAPPY_PATH =
  'recipe "<job>" → recommend unbound slots → Figma on those figmaNodeIds → verify_frame. Do not Read graph.json.';

export function LibraryOverview() {
  const graph = useGraphStore((state) => state.graph);
  const analytics = useGraphStore((state) => state.analytics);
  const setMode = useGraphStore((state) => state.setMode);
  const atlas = useAtlas();
  const [copied, setCopied] = useState(false);

  if (!graph || !analytics) return null;

  const health = libraryHealth(analytics);
  const clusters = atlas?.communities.communities.length ?? 0;
  const modularity = atlas?.communities.modularity;

  const copyHint = async () => {
    try {
      await navigator.clipboard.writeText(AGENT_HAPPY_PATH);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="overview" aria-label="Library overview">
      <div className="overview__identity">
        <p className="overview__kicker">Loaded library</p>
        <p className="overview__title">{graph.fileName}</p>
        <p className="overview__meta">
          {clusters} clusters
          {modularity !== undefined ? ` · Q ${modularity.toFixed(3)}` : ""} · {graph.source.kind}
        </p>
      </div>

      <div className="overview__health">
        <HealthChip tone={health.tone} label={health.label} />
        <p>{health.detail}</p>
      </div>

      <div className="overview__actions">
        <button type="button" className="button--primary" onClick={() => setMode("explorer")}>
          Open Explorer
        </button>
        <button type="button" className="button--ghost" onClick={() => void copyHint()}>
          {copied ? "Copied path" : "Copy agent path"}
        </button>
      </div>
    </section>
  );
}
