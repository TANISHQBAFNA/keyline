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

## Resolve

Use Resolve before any Figma screen build or design-from-brief work. **Never Read `graph.json`.**

Tagline: **Figma rules. Agents resolve.**

### Process

ingest → (optional) recipe → recommend unbound slots → draw (figmaNodeId) → verify_frame → human taste

Prefer **resolve** over any `keyline` / `graphify` alias.

### Commands

```bash
npm run build:server
npm run resolve -- ingest '<url>'          # re-run to refresh library
npm run resolve -- recipe list
npm run resolve -- recipe "checkout summary"
npm run resolve -- recommend "checkout with primary button"
npm run resolve -- resolve "Main Card"     # when you already know the name
npm run resolve -- verify "Checkout"
```

### Create a screen

1. Optional: `recipe` the screen job — pack of masters + slots with `figmaNodeId`s.
2. `recommend` unbound slots — ranked masters, deprecated demoted. Do not invent one-offs.
3. Use `use_figma` / `get_design_context` on the returned `figmaNodeId` only.
4. `verify_frame` the new frame or placed names (invents / deprecated / unresolved).
5. Never `Read` `.graphify/graph.json`.

### Caps

- **Level-1** (default): single component / local edit
- **Level-2**: only for large blast radius
- **Whole-file**: only if explicitly asked
