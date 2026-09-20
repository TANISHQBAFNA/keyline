---
name: keyline
description: Use Keyline before any Figma screen build or design-from-brief work in Cursor. Call resolve for a cheap component usage card. Never Read graph.json.
---

# Keyline

Use Keyline before any Figma screen build or design-from-brief work in Cursor. Call `resolve` for a cheap component usage card. **Never Read `graph.json`.**

## Process

1. **Brief** — clarify what screen or component set is needed
2. **Keyline resolve** — get component usage cards (masters, variants, props)
3. **Draw** — build in Figma using resolved `figmaNodeId`s only
4. **Human taste** — pause for review; do not over-generate

Prefer **keyline** over any `graphify` alias when both exist.

## Commands

```bash
# Build the Keyline server/CLI
npm run build:server

# Ingest a Figma file (or design URL)
npm run keyline -- ingest '<url>'

# Resolve a named master / component
npm run keyline -- resolve "Main Card"
npm run keyline -- resolve "Input Field"
npm run keyline -- resolve "Badge"
```

Run resolve for every master you plan to place before calling Figma tools.

## Create a screen

1. From the brief, list masters (e.g. Main Card, Input Field, Badge).
2. `npm run keyline -- resolve "<Name>"` for each — note `figmaNodeId` and usage card.
3. Call `use_figma` / `get_design_context` **only** with those `figmaNodeId`s.
4. **Never** `Read` `.graphify/graph.json` (or any `graph.json`). Keyline cards are the source of truth for usage.

## Caps

| Level | When |
|-------|------|
| **Level-1** (default) | Single component / local edit — resolve + place |
| **Level-2** | Only when blast radius is large (shared masters, multi-screen impact) |
| **Whole-file** | Only if the user explicitly asks |

Stay at Level-1 unless the change clearly needs broader scope.
