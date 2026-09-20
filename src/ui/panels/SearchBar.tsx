import { useState } from "react";
import { useGraphStore } from "@/state/graphStore";

const EXAMPLES = [
  "type:instance Button",
  "type:component used-in:Checkout",
  "page:Payments",
  "instance-of:Button",
  "variable:color",
  "unused-components",
  "orphaned-frames",
  "is:remote",
  "is:deprecated",
];

export function SearchBar() {
  const query = useGraphStore((state) => state.query);
  const setQuery = useGraphStore((state) => state.setQuery);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="search">
      <div className="search__row">
        <input
          type="search"
          value={query}
          placeholder="Search nodes — try type:instance Button"
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search the graph"
        />
        <button
          type="button"
          className="search__help"
          aria-expanded={showHelp}
          onClick={() => setShowHelp((value) => !value)}
          title="Query syntax"
        >
          ?
        </button>
      </div>
      {showHelp && (
        <div className="search__examples">
          <p className="search__hint">
            Terms are combined with AND. Prefix with <code>-</code> to negate.
          </p>
          {EXAMPLES.map((example) => (
            <button key={example} type="button" onClick={() => setQuery(example)}>
              {example}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
