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
