import { useRef, useState } from "react";
import { JsonIngestionSource } from "@/core/ingestion/adapters/jsonSource";
import { useGraphStore } from "@/state/graphStore";

/**
 * Loads a plugin export (or any `SourceDocument`/REST file body) from disk.
 * `JsonIngestionSource` validates against the schema first, so a plugin export
 * bypasses the adapters entirely.
 */
export function ImportButton() {
  const loadSource = useGraphStore((state) => state.loadSource);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        title={error ?? undefined}
        aria-label="Import JSON"
      >
        Import JSON
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="visually-hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setError(null);
          try {
            const payload = JSON.parse(await file.text());
            await loadSource(
              new JsonIngestionSource(`json:${file.name}`, file.name, payload, file.name),
            );
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : String(cause));
          } finally {
            event.target.value = "";
          }
        }}
      />
    </>
  );
}
