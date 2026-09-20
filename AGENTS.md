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

## Keyline

Use Keyline before any Figma screen build or design-from-brief work. Call `resolve` for a cheap component usage card. **Never Read `graph.json`.**

### Process

brief → keyline resolve → draw → human taste

Prefer **keyline** over any `graphify` alias.

### Commands

```bash
npm run build:server
npm run keyline -- ingest '<url>'
npm run keyline -- resolve "Main Card"
npm run keyline -- resolve "Input Field"
npm run keyline -- resolve "Badge"
```

### Create a screen

1. Resolve masters from the brief (`Main Card`, `Input Field`, `Badge`, etc.).
2. Use `use_figma` / `get_design_context` on the returned `figmaNodeId` only.
3. Never `Read` `.graphify/graph.json`.

### Caps

- **Level-1** (default): single component / local edit
- **Level-2**: only for large blast radius
- **Whole-file**: only if explicitly asked

