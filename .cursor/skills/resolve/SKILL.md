---
name: resolve
description: Use Resolve before any Figma screen build or design-from-brief work in Cursor. Call resolve for a cheap component usage card. Never Read graph.json.
---

# Resolve

Use Resolve before any Figma screen build or design-from-brief work in Cursor. Call `resolve` for a cheap component usage card. **Never Read `graph.json`.**

Tagline: **Figma rules. Agents resolve.**

## Process

1. **Brief** — clarify what screen or component set is needed
2. **Resolve** — get component usage cards (masters, variants, props)
3. **Draw** — build in Figma using resolved `figmaNodeId`s only
4. **Human taste** — pause for review; do not over-generate

Prefer **resolve** over any `keyline` / `graphify` alias when both exist. `npm run keyline` is a deprecated alias for `npm run resolve` this release.

## Commands

```bash
# Build the Resolve server/CLI
npm run build:server

# Ingest a Figma file (or design URL)
npm run resolve -- ingest '<url>'

# Resolve a named master / component (CLI verb is `resolve`)
npm run resolve -- resolve "Main Card"
npm run resolve -- resolve "Input Field"
npm run resolve -- resolve "Badge"
```

Run resolve for every master you plan to place before calling Figma tools.

## Create a screen

1. From the brief, list masters (e.g. Main Card, Input Field, Badge).
2. `npm run resolve -- resolve "<Name>"` for each — note `figmaNodeId` and usage card.
3. Call `use_figma` / `get_design_context` **only** with those `figmaNodeId`s.
4. **Never** `Read` `.graphify/graph.json` (or any `graph.json`). Resolve cards are the source of truth for usage.

## Caps

| Level | When |
|-------|------|
| **Level-1** (default) | Single component / local edit — resolve + place |
| **Level-2** | Only when blast radius is large (shared masters, multi-screen impact) |
| **Whole-file** | Only if the user explicitly asks |

Stay at Level-1 unless the change clearly needs broader scope.
