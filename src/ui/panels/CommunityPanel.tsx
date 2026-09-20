import { useGraphStore } from "@/state/graphStore";
import { useAtlas } from "@/state/selectors";

/**
 * The communities list, in the spirit of Graphify's legend: each partition
 * named after its highest-degree member, sized, coloured, and switchable.
 */
export function CommunityPanel() {
  const atlas = useAtlas();
  const hidden = useGraphStore((state) => state.atlas.hiddenCommunities);
  const collapseInstances = useGraphStore((state) => state.atlas.collapseInstances);
  const resolution = useGraphStore((state) => state.atlas.resolution);
  const excludeHubs = useGraphStore((state) => state.atlas.excludeHubs);
  const minDegree = useGraphStore((state) => state.atlas.minDegree);
  const setAtlas = useGraphStore((state) => state.setAtlas);
  const toggleCommunity = useGraphStore((state) => state.toggleCommunity);
  const setAllCommunities = useGraphStore((state) => state.setAllCommunities);
  const focusNode = useGraphStore((state) => state.focusNode);

  if (!atlas) return null;

  const all = atlas.communities.communities;
  const allIds = all.map((community) => community.id);
  const hiddenSet = new Set(hidden);
  const allVisible = hidden.length === 0;

  return (
    <section className="communities" aria-label="Communities">
      <div className="communities__controls">
        <label className="communities__toggle">
          <input
            type="checkbox"
            checked={collapseInstances}
            onChange={(event) => setAtlas({ collapseInstances: event.target.checked })}
          />
          Collapse instances into components
        </label>

        <label className="communities__toggle">
          <input
            type="checkbox"
            checked={excludeHubs}
            onChange={(event) => setAtlas({ excludeHubs: event.target.checked })}
          />
          Exclude hubs from clustering
        </label>

        <label className="communities__slider">
          <span>
            Resolution <b>{resolution.toFixed(1)}</b>
          </span>
          <input
            type="range"
            min={0.4}
            max={2.4}
            step={0.2}
            value={resolution}
            onChange={(event) => setAtlas({ resolution: Number(event.target.value) })}
          />
        </label>

        <label className="communities__slider">
          <span>
            Min degree <b>{minDegree}</b>
          </span>
          <input
            type="range"
            min={0}
            max={4}
            step={1}
            value={minDegree}
            onChange={(event) => setAtlas({ minDegree: Number(event.target.value) })}
          />
        </label>
      </div>

      <header className="panel__header">
        <h2>Communities</h2>
        <span className="panel__count">{all.length}</span>
      </header>

      <ul className="communities__list">
        <li>
          <label className="communities__row communities__row--all">
            <input
              type="checkbox"
              checked={allVisible}
              onChange={(event) => setAllCommunities(allIds, event.target.checked)}
            />
            <span className="communities__name">Select All</span>
          </label>
        </li>
        {all.map((community) => (
          <li key={community.id}>
            <label className="communities__row">
              <input
                type="checkbox"
                checked={!hiddenSet.has(community.id)}
                onChange={() => toggleCommunity(community.id)}
              />
              <span className="communities__dot" style={{ background: community.color }} />
              <button
                type="button"
                className="communities__name"
                title={`Hub: ${community.name} · ${community.internalEdges} internal edges`}
                onClick={(event) => {
                  event.preventDefault();
                  focusNode(community.hubId);
                }}
              >
                {community.name}
              </button>
              <span className="communities__count">{community.size}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
