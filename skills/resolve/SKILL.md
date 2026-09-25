---
name: resolve
description: Use Resolve before any Figma screen build or design-from-brief work in Cursor. Forced path: ingest → recipe → recommend unbound slots → place returned ids only → verify_frame. Never Read graph.json. Never invent components.
---

# Resolve

**Figma rules. Agents resolve.** Never `Read` `graph.json`. Never invent components.

## Forced path (do this, in order)

1. **Ingest** — store the library. Re-run when Figma changed.
2. **Recipe** — if the screen job matches a pack (`recipe list` / `recipe "<job>"`). After ingest, slots bind to live `figmaNodeId`s. Overlay `.graphify/recipes.json` still wins.
3. **Recommend** — every unbound / missing / deprecated slot. Use that slot’s `nextRecommend` query.
4. **Place** — Figma MCP (`use_figma` / `get_design_context`) on returned ids **only**.
5. **Verify** — `verify_frame` on the new frame or placed names.
6. **Human taste** — stop. Do not over-generate.

Prefer **resolve** over any `keyline` / `graphify` alias. `npm run keyline` is a deprecated alias this release.

## Commands (copy-paste)

```bash
npm run build:server
npm run resolve -- ingest '<url>'                 # refresh if the library changed
npm run resolve -- recipe list
npm run resolve -- recipe "checkout summary"
npm run resolve -- recommend "checkout with primary button and input"
npm run resolve -- resolve "Main Card"            # only if you already know the name
npm run resolve -- verify "Checkout Summary"
npm run resolve -- verify --components "Button,MadeUpCard"
```

## Forbidden

- Invent a component, name, or node id.
- `Read` `.graphify/graph.json` or any `graph.json`. Cards are the source of truth.
- Dump the graph / REST / whole-file metadata into context.
- Call `get_design_context` on a FRAME or SECTION until recipe/recommend/resolve returned that id.
- Place a deprecated or missing master. Call `recommend` for a live one.

Optional allow/deny: `.graphify/library-rules.json` `{ "allow": ["Button"], "deny": ["Banner"] }`. If missing, approved = in-graph MAIN_COMPONENT / VARIANT (or COMPONENT_SET) and not deprecated.

Designers edit `src/data/recipes.json` or overlay `.graphify/recipes.json`. See `docs/RECIPES.md`. Do not invent `defaultMasterId`s.

Skill tools: `list_recipes`, `recipe` / `get_recipe`, `recommend`, `resolve`, `verify_frame`, `get_screen_inventory`, `check_frame` (analog shortcut).

## Caps

| Level | When |
|-------|------|
| **Level-1** (default) | Single component / local edit — recipe or recommend + place + verify |
| **Level-2** | Only when blast radius is large (shared masters, multi-screen impact) |
| **Whole-file** | Only if the user explicitly asks |

Stay at Level-1 unless the change clearly needs broader scope.
