## Resolve — forced path (copy this)

Use Resolve before any Figma screen build or design-from-brief work. **Never Read `graph.json`.** Never invent components.

Tagline: **Figma rules. Agents resolve.**

### Do this, in order

```bash
npm run build:server
npm run resolve -- ingest '<url>'          # re-run if the library changed
npm run resolve -- recipe list             # after ingest, slots bind to live ids
npm run resolve -- recipe "checkout summary"
npm run resolve -- recommend "checkout with primary button"
# place ONLY the returned figmaNodeIds
npm run resolve -- verify "Checkout"
```

1. **Ingest** — refresh if the Figma library changed.
2. **Context / recipe** — if the screen job matches a pack. Overlay `.graphify/recipes.json` still wins. Optional `.graphify/context-packs.json` scopes product + journey.
3. **Recommend** — unbound / missing / deprecated slots (`nextRecommend` on the card). Optional `--pack` / `--product` / `--journey`.
4. **Place** — `use_figma` / `get_design_context` on returned ids only.
5. **Verify** — `verify_frame` (invents / deprecated / unresolved).

### Forbidden

- Invent components, names, or node ids.
- `Read` `.graphify/graph.json` or dump the graph.
- `get_design_context` on a FRAME until recipe/recommend/resolve returned that id.

Designers add recipes in JSON (`src/data/recipes.json` or `.graphify/recipes.json`) and product+journey packs in `.graphify/context-packs.json`. See `docs/RECIPES.md`.

Prefer **resolve** over any `keyline` / `graphify` alias.

### Caps

- **Level-1** (default): single component / local edit
- **Level-2**: only for large blast radius
- **Whole-file**: only if explicitly asked
