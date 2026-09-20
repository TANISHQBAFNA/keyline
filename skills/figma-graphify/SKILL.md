---
name: figma-graphify
description: >-
  Query a Figma relationship graph for component instances, variants, blast
  radius, and screen structure. Use when a Figma URL is shared, before reading
  a Figma file or calling Figma MCP get_design_context. Call resolve for a
  usage card — never Read graph.json.
---

# Figma Graphify

Ingest the **shared node**. Graph stays on disk (`.graphify/graph.json`).
**Do not Read that file.** Call `resolve` for a usage card, then Figma on that
`figmaNodeId`.

## When a Figma link appears

1. Keep the URL **exactly** — `node-id` is the ingest scope (screen, frame, or section).
2. Ingest once if no graph is stored:

```bash
export FIGMA_ACCESS_TOKEN=figd_…
npm run build:server   # first time / after pull
npm run graphify -- ingest '<pasted-figma-url>'
```

3. **`resolve "<component>"`** — screens, counts, slot fills, `figmaNodeId`. Cap ~2000 chars.

Do **not**:

- Read `.graphify/graph.json` or dump REST JSON
- Strip `?node-id=` and fetch the whole file
- Map every screen unless the user asked for the whole file
- Call `get_design_context` on a FRAME or SECTION until `resolve` returns an id
- Start from `orient` / `explain` / `get_subgraph`

## Create / recreate a screen (Figma or code)

1. `resolve "Main Card"` (repeat for Header, Input Field, Special Button, …).
2. `use_figma` / `get_design_context` on **that** `figmaNodeId` only.
3. Reuse names from the card. Do not invent primitives the card already lists.

Frame name (`resolve "Portfolio"`) returns a screen inventory (each component once, with a count). Analog for a **new** screen: `check_frame "pay now buttons"`.

Skill tools: `resolve`, `get_screen_inventory`, `check_frame`.

## Whole file

No `node-id`, or user said "map the file": ingest walks **each top-level FRAME/SECTION**, one REST call at a time. Slow. Expected.

```bash
npm run graphify -- ingest '<file-url>'              # screen-by-screen
npm run graphify -- ingest '<file-url>' --scope file # one dump (escape hatch)
```

## Commands

```bash
npm run graphify -- ingest '<figma-url>'
npm run mcp
```
