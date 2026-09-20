# Keyline

> Repo: [TANISHQBAFNA/keyline](https://github.com/TANISHQBAFNA/keyline)

Turn any Figma file into an explorable relationship graph: pages, sections, frames, components, instances, variants, styles, variables, libraries and prototype flows — plus how they connect.

**Phase 1** is a working prototype with a deterministic graph foundation, mock fixtures, and a CLI agents can call without dumping the whole file into context.

No Figma personal access token is required for the usual agent path. It ships with sample fixtures for offline UI and tests. For live files, prefer **Figma MCP** inside Claude, Cursor, Codex, and similar tools (or the Figma plugin). REST token ingest is optional and not needed for most workflows.

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

Works through **Figma MCP** in Claude, Cursor, Codex, etc. — no `FIGMA_ACCESS_TOKEN` required.

1. Connect / enable Figma MCP in your AI tool (and Figma desktop Dev Mode MCP if your setup uses it).
2. Paste a Figma **screen / frame / section** link (not a whole-file dump unless you ask for it).
3. Let the agent **ingest via MCP** into Keyline (or save an MCP capture and `npm run keyline -- ingest <capture.json>`).
4. `npm run keyline -- resolve "Component Name"` for each master you will place.
5. Draw in Figma using the returned `figmaNodeId` only.
6. **Do not Read** `.graphify/graph.json` — resolve is the cheap path.

```bash
npm run keyline -- resolve "Component Name"
```

Prefer the **`keyline`** script over any `graphify` alias when both exist.

Humans exploring the graph UI: `npm run dev` (sample data loads with no credentials).

## Two views

**Atlas** — the whole file on one canvas. Instances fold into their components so each component is a single node wired to every frame that uses it; communities are detected, named after their hub, and switchable from the sidebar. Force-directed, deterministic, canvas-rendered.

**Explorer** — focused, level-based traversal for one page, one screen, or one component’s blast radius.

## Getting a real file in

| Source | Setup | Instance → component |
|---|---|---|
| **Figma MCP** (Claude / Cursor / Codex / Dev Mode) | Use the tool’s Figma MCP — **no personal access token** | Inferred from name |
| **Figma plugin** (`figma-plugin/`) | Import the manifest; no build, no token | Exact |
| JSON import | Drop an MCP or plugin capture | As captured |
| Figma REST (optional) | Personal access token — only if you explicitly want CLI REST ingest | Exact |

**Recommended for agents:** Figma MCP. Plugin is fine for human export. REST token is optional, not part of the default path — see `figma-plugin/README.md` for the plugin.

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
