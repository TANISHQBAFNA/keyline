---
name: resolve
description: Use Resolve before any Figma screen build or design-from-brief work in Cursor. Call recipe for a screen pack, recommend for unbound slots, then verify_frame after drawing. Never Read graph.json.
---

# Resolve

Use Resolve before any Figma screen build or design-from-brief work in Cursor. **Never Read `graph.json`.**

Tagline: **Figma rules. Agents resolve.**

## Process

1. **Ingest** — store the library graph (re-run when Figma changes)
2. **Recipe** (optional) — named screen pack: ordered slots with real `figmaNodeId`s
3. **Recommend** — brief/intent → ranked masters for unbound slots
4. **Draw** — Figma MCP using returned ids only; do not invent one-offs
5. **Verify** — `verify_frame` flags invents / deprecated / unresolved
6. **Human taste** — pause for review; do not over-generate

Prefer **resolve** over any `keyline` / `graphify` alias when both exist. `npm run keyline` is a deprecated alias for `npm run resolve` this release.

## Commands

```bash
# Build the Resolve server/CLI
npm run build:server

# Ingest a Figma file (or design URL). Re-run to refresh the library.
npm run resolve -- ingest '<url>'

# Screen packs (composition recipes)
npm run resolve -- recipe list
npm run resolve -- recipe "checkout summary"

# Ranked masters from a brief (unbound slots / no recipe)
npm run resolve -- recommend "checkout summary with primary button and input"

# Usage card when you already know the master name
npm run resolve -- resolve "Main Card"
npm run resolve -- resolve "Input Field"

# After drawing: invent rate
npm run resolve -- verify "Checkout Summary"
npm run resolve -- verify --components "Button,MadeUpCard"
```

Optional allow/deny: `.graphify/library-rules.json` `{ "allow": ["Button"], "deny": ["Banner"] }`. If that file is missing, approved = in-graph MAIN_COMPONENT / VARIANT (or COMPONENT_SET) and not deprecated.

Designers add recipes in `src/data/recipes.json` or overlay `.graphify/recipes.json`. See `docs/RECIPES.md`. Do not invent `defaultMasterId`s.

## Create a screen

1. Optional: `recipe "<screen job>"` — note slot `figmaNodeId`s. Unbound slots include the next `recommend` query.
2. `recommend "<intent>"` for unbound slots. Do not invent names.
3. Call `use_figma` / `get_design_context` **only** with those `figmaNodeId`s.
4. `verify_frame` on the new frame or the placed name list.
5. **Never** `Read` `.graphify/graph.json` (or any `graph.json`). Cards are the source of truth.

Skill tools: `list_recipes`, `recipe` / `get_recipe`, `recommend`, `resolve`, `verify_frame`, `get_screen_inventory`, `check_frame` (analog shortcut).

## Caps

| Level | When |
|-------|------|
| **Level-1** (default) | Single component / local edit — recipe or recommend + place + verify |
| **Level-2** | Only when blast radius is large (shared masters, multi-screen impact) |
| **Whole-file** | Only if the user explicitly asks |

Stay at Level-1 unless the change clearly needs broader scope.
