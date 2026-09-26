<!-- caveman-begin -->
Respond terse like smart caveman. All technical substance stay. Only fluff die.

Rules:
- Drop: articles (a/an/the), filler (just/really/basically), pleasantries, hedging
- Fragments OK. Short synonyms. Technical terms exact. Code unchanged.
- Pattern: [thing] [action] [reason]. [next step].
- Not: "Sure! I'd be happy to help you with that."
- Yes: "Bug in auth middleware. Fix:"

Switch level: /caveman lite|full|ultra|wenyan-lite|wenyan-full|wenyan-ultra
Stop: "stop caveman" or "normal mode"

Auto-Clarity: drop caveman for security warnings, irreversible actions, user confused. Resume after.

Boundaries: code/commits/PRs written normal.
<!-- caveman-end -->

## Resolve — forced path (copy this)

Use Resolve before any Figma screen build or design-from-brief work.

**Tagline:** Figma rules. Agents resolve.

### Do this, in order

```bash
npm run build:server
npm run resolve -- ingest '<figma-url>'    # re-run if the library changed
npm run resolve -- recipe list             # after ingest, slots bind to live ids
npm run resolve -- recipe "checkout summary"
npm run resolve -- recommend "checkout with primary button"   # unbound slots only
# place ONLY the returned figmaNodeIds (use_figma / get_design_context)
npm run resolve -- verify "Checkout Summary"
```

| Step | When | Tool |
|------|------|------|
| 1. Ingest | No graph, or Figma library changed | `ingest '<url>'` |
| 2. Context / recipe | Screen job matches a pack (checkout, sign-in, empty state, …). Optional `.graphify/context-packs.json` scopes product + journey | `recipe list` then `recipe "<job>"` |
| 3. Recommend | Slot is unbound / missing / deprecated | `recommend "<nextRecommend>"` (optional `--pack` / `--product` / `--journey`) |
| 4. Place | Drawing in Figma | returned `figmaNodeId`s **only** |
| 5. Verify | After the draw | `verify_frame` on the frame or placed names |

MCP: `list_recipes` → `recipe` → `recommend` → Figma → `verify_frame`.

### Forbidden

- Invent components, names, or node ids.
- `Read` `.graphify/graph.json` (or any `graph.json`). Cards/CLI/MCP only.
- Dump the graph, REST JSON, or a whole-file metadata tree into context.
- `get_design_context` / `use_figma` on a FRAME or SECTION until recipe/recommend/resolve returned that id.
- Skip ingest when the library changed. Re-ingest is the refresh path.

`.graphify/recipes.json` overlay still wins over the starter pack. Optional `.graphify/context-packs.json` binds product + journey to recipes so recommend is not a generic name match. Do not invent `defaultMasterId`s or Figma node ids in packs. See `docs/RECIPES.md`.

Prefer **resolve** over any `keyline` / `graphify` alias.

### Caps

- **Level-1** (default): single component / local edit
- **Level-2**: only for large blast radius
- **Whole-file**: only if the user explicitly asks
