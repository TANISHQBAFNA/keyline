# Keyline

> Repo: [TANISHQBAFNA/keyline](https://github.com/TANISHQBAFNA/keyline)

Turn any Figma file into an explorable relationship graph: pages, sections, frames, components, instances, variants, styles, variables, libraries and prototype flows — plus how they connect.

**Phase 1** is a working prototype with a deterministic graph foundation, mock fixtures, and a CLI agents can call without dumping the whole file into context.

No Figma credentials are required to try it locally. It ships with sample fixtures so you can explore the UI and run tests offline. For live files, ingest via plugin, MCP, or REST when you are ready.

## Why a graph and not another file read

| Question | Re-reading the file | Traversing the graph |
|---|---|---|
| What components are on this screen, and how often? | Large dump; answer must be derived | Small card; answer included |
| Where is this master used? | Large dump; answer must be derived | Bounded subgraph |
| The whole graph | — | Never sent — call `resolve` |

Ingest once into `.graphify/graph.json`. Agents call `resolve`; they should **not** Read that file.

## Quick start

```bash
npm install
npm run dev
npm test
npm run typecheck
```

## Install for Claude, Codex, Cursor (and similar)

Clone the public repo, build the CLI once, then point your AI tool at this folder.

```bash
git clone https://github.com/TANISHQBAFNA/keyline.git
cd keyline
npm install
npm run build:server
```

| Tool | How |
|---|---|
| **Cursor** | Open the cloned repo (or add it to the chat). Prefer skill `skills/keyline`. Also: `.cursor/skills/figma-graphify`, MCP in `.cursor/mcp.json`. |
| **Claude Code** | From the repo root: `claude --plugin-dir .` after `npm run build:server`. Manifest: `.claude-plugin/plugin.json`. |
| **Codex / other agents** | Point the session at the repo root. Read `AGENTS.md` + `skills/keyline/SKILL.md`. |

### Everyday agent flow

1. Ingest a Figma **screen / frame / section** link (not a whole-file dump unless you ask for it).
2. `npm run keyline -- resolve "Component Name"` for each master you will place.
3. Draw in Figma using the returned `figmaNodeId` only.
4. **Do not Read** `.graphify/graph.json` — resolve is the cheap path.

```bash
export FIGMA_ACCESS_TOKEN=figd_…   # for live ingest
npm run keyline -- ingest 'https://www.figma.com/design/<fileKey>/Name?node-id=1-2'
npm run keyline -- resolve "Component Name"
```

No `node-id` (whole file): each top-level FRAME/SECTION is fetched separately (slower). `--scope file` is the one-shot dump.

Prefer the **`keyline`** script over any `graphify` alias when both exist.

Humans: `npm run dev` → **Load Figma** (token stays in this tab).

## Two views

**Atlas** — the whole file on one canvas. Instances fold into their components so each component is a single node wired to every frame that uses it; communities are detected, named after their hub, and switchable from the sidebar. Force-directed, deterministic, canvas-rendered.

**Explorer** — focused, level-based traversal for one page, one screen, or one component’s blast radius.

## Getting a real file in

| Source | Setup | Instance → component |
|---|---|---|
| **Figma plugin** (`figma-plugin/`) | Import the manifest; no build, no token | Exact |
| Figma MCP (Dev Mode server) | Enable it in Figma desktop | Inferred from name |
| Figma REST | Personal access token | Exact |
| JSON import | Drop in any of the above | As captured |

The plugin is the recommended path — see `figma-plugin/README.md`.

## What you can do in Phase 1

1. Open the sample graph (it loads on start).
2. Select a page and see its sections, screens, and prototype flow.
3. Select a frame and see the component instances inside it, at any depth.
4. Select an instance and jump to the main component it references.
5. Select a main component and see every instance, grouped by page, with frames affected.
6. Read the path `File → Page → Section → Frame → Instance → Main component` in the breadcrumb.
7. Search and filter without rendering an unrestricted graph.
8. Export a small, structured subgraph payload for any agent.

### Interaction

| Action | Result |
|---|---|
| Click a node | Inspect it |
| Shift-click a node | Re-root the graph on it |
| Double-click a node | Expand / collapse its children in place |
| ⌘/Ctrl-click | Add to the selection (the AI payload uses the selection) |
| Click a browser row or breadcrumb | Re-root the graph |
| ← / → in the toolbar | Graph navigation history |

### Query language

Terms are combined with AND; prefix any term with `-` to negate it.

```
Button                       free text over names
type:instance Button         node type + free text
type:component used-in:ScreenName
page:PageName                everything on a page
instance-of:Button           instances of a component or component set
variable:color               variables by name or resolved type
is:remote                    library-sourced entities
unused-components            macro
orphaned-frames              macro
unresolved-instances         macro
frames-without-components    macro
```

Keys: `type`, `name`, `page`, `section`, `frame`, `instance-of`, `used-in`, `style`, `variable`, `library`, `is`.

## Structure

```
src/core/model        graph schema (Zod), node + edge types, id namespacing
src/core/ingestion    any source → SourceDocument
src/core/transform    SourceDocument → DesignGraph
src/core/query        indexes, traversal, search, filters, analytics, subgraph levels
src/core/ai           bounded subgraph payloads + provider-agnostic LLM interface
src/state             Zustand store and selectors
src/ui                React Flow canvas, inspector, browser, filters
src/mock              REST-shaped fixtures
tests                 vitest, core layers only
docs                  architecture and integration guides
```

Nothing in `src/core` imports React. Everything the UI shows comes from `GraphIndex` and `extractSubgraph`.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — problem statement, assumptions and Figma API limits, domain model, tradeoffs, progressive disclosure.
- [`docs/INTEGRATIONS.md`](docs/INTEGRATIONS.md) — Figma REST, plugin, MCP, and how agents plug in.
- [`docs/CURSOR-KEYLINE.md`](docs/CURSOR-KEYLINE.md) — everyday Cursor + Keyline flow.

## License

MIT — see [`LICENSE`](LICENSE).

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| 1 | Graph foundation, explorer, inspector, search, filters, AI payload export | ✅ this repo |
| 2 | Design-system analytics dashboard, coverage and usage reports | Engine exists, UI pending |
| 3 | Live Figma REST / plugin / MCP ingestion, thumbnails, deep links | Seams in place |
| 4 | LLM provider registry, in-app AI actions | Interface in place |
