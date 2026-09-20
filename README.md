# Figma Graphify

Turn any Figma file into an explorable relationship graph: pages, sections,
frames, components, instances, variants, styles, variables, libraries and
prototype flows, plus the relationships between them.

This repository contains **Phase 1** — a working prototype on realistic mock
data, with the full deterministic graph foundation underneath it.

> No Figma credentials are needed to run it. It ships with two sources:
>
> - **CBX300 — Portfolio screen** — a real file captured through the Figma Dev
>   Mode MCP server (87 instances, 224 graph nodes). Deep links open the actual
>   file.
> - **Acme Pay (mock)** — a REST-shaped fixture exercising component sets,
>   variants, prototype flows and library components, through exactly the same
>   adapter a live Figma response would use.

## Why a graph and not another file read

Measured on the CBX300 Portfolio screen:

| Question | Re-reading the file | Traversing the graph |
|---|---|---|
| "What components are on this screen, and how often?" | 14,394 chars, answer must be derived | **586 chars**, answer included |
| "Where is `Main Card` used?" | 14,394 chars, answer must be derived | **4,124 chars** bounded subgraph |
| The whole graph | — | never sent — call `resolve` |

Ingest once into `.graphify/graph.json`. Agents call `resolve`, do not Read that file.

## Quick start

```bash
npm install
```

```bash
npm run dev
```

```bash
npm test
```

```bash
npm run typecheck
```

## Install as an agent plugin

This repo is the plugin. Add it to Cursor, Claude Code, or Codex, then paste a Figma **screen / frame / section** link. The agent maps that node — not the whole file.

| Tool | How |
|---|---|
| **Cursor** | Open this repo (or add it to the chat). Skill at `.cursor/skills/figma-graphify`. MCP in `.cursor/mcp.json`. |
| **Claude Code** | `claude --plugin-dir /path/to/figma-graphify` after `npm run build:server`. Manifest: `.claude-plugin/plugin.json`. |
| **Codex** | Point the session at this repo. `AGENTS.md` + `skills/figma-graphify/SKILL.md`. |

```bash
npm install
npm run build:server
export FIGMA_ACCESS_TOKEN=figd_…
npm run graphify -- ingest 'https://www.figma.com/design/<fileKey>/Name?node-id=1-2'
```

No `node-id` (whole file): each top-level FRAME/SECTION is fetched separately. Slower. `--scope file` is the one-shot dump.

Agents: `resolve "<component>"` (usage card), then Figma on that `figmaNodeId`. Do not Read `graph.json`. Skill: `skills/figma-graphify/SKILL.md`.

Humans: `npm run dev` → **Load Figma** (PAT stays in this tab).

## Two views

**Atlas** — the whole file on one canvas. Instances fold into their components
so each component is a single node wired to every frame and group that uses it;
communities are detected with Louvain, named after their hub node, and
switchable from the sidebar. Force-directed, deterministic, canvas-rendered.

**Explorer** — focused, level-based traversal for one page, one screen or one
component's blast radius.

## Getting a real file in

| Source | Setup | Instance → component |
|---|---|---|
| **Figma plugin** (`figma-plugin/`) | import the manifest, no build, no token | exact |
| Figma MCP (Dev Mode server) | enable it in Figma desktop | inferred from name |
| Figma REST | personal access token | exact |
| JSON import | drop in any of the above | as captured |

The plugin is the recommended path — see `figma-plugin/README.md`.

## What you can do in Phase 1

1. Open the mock file graph (it loads on start).
2. Select a page and see its sections, screens and prototype flow.
3. Select a frame and see the component instances inside it, at any depth.
4. Select an instance and jump to the main component it references.
5. Select a main component and see every instance, grouped by page, with the
   frames and pages affected.
6. Read the full path `File → Page → Section → Frame → Instance → Main component`
   in the breadcrumb.
7. Search and filter without ever rendering an unrestricted graph.
8. Export a small, structured subgraph payload for Claude, Cursor or any agent.

### Interaction

| Action | Result |
|---|---|
| Click a node | Inspect it |
| Shift-click a node | Re-root the graph on it |
| Double-click a node | Expand / collapse its children in place |
| ⌘/Ctrl-click | Add to the selection (the AI payload uses the selection) |
| Click a browser row or breadcrumb | Re-root the graph |
| `←` / `→` in the toolbar | Graph navigation history |

### Query language

Terms are combined with AND; prefix any term with `-` to negate it.

```
Button                       free text over names
type:instance Button         node type + free text
type:component used-in:Checkout
page:Payments                everything on a page
instance-of:Button           instances of a component or component set
variable:color               variables by name or resolved type
is:remote                    library-sourced entities
unused-components            macro
orphaned-frames              macro
unresolved-instances         macro
frames-without-components    macro
```

Keys: `type`, `name`, `page`, `section`, `frame`, `instance-of`, `used-in`,
`style`, `variable`, `library`, `is`.

## Structure

```
src/core/model        graph schema (Zod), node + edge types, id namespacing
src/core/ingestion    any source -> SourceDocument   (Figma REST adapter lives here)
src/core/transform    SourceDocument -> DesignGraph  (classification, edges, warnings)
src/core/query        indexes, traversal, search, filters, analytics, subgraph levels
src/core/ai           bounded subgraph payloads + provider-agnostic LLM interface
src/state             Zustand store and selectors
src/ui                React Flow canvas, inspector, browser, filters
src/mock              REST-shaped fixture (file + variables)
tests                 vitest, core layers only
docs                  architecture and integration guides
```

Nothing in `src/core` imports React. Everything the UI shows comes from
`GraphIndex` and `extractSubgraph`.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — problem statement,
  assumptions and Figma API limitations, domain model, library choice and
  tradeoffs, folder structure, progressive disclosure design.
- [`docs/INTEGRATIONS.md`](docs/INTEGRATIONS.md) — how the Figma REST API, a
  Figma plugin, Figma MCP, Claude, and Cursor plug in — and how to serve this
  graph *to* an MCP client.

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| 1 | Graph foundation, explorer, inspector, search, filters, AI payload export | ✅ this repo |
| 2 | Design-system analytics dashboard, coverage reporting, dependency/usage reports | engine exists, UI pending |
| 3 | Live Figma REST / plugin / MCP ingestion, thumbnails, real deep links | seams in place |
| 4 | LLM provider registry, in-app AI actions | interface in place |
