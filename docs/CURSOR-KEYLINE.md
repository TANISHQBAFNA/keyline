# Cursor + Keyline — how-to (Tanishk)

Everyday flow for using Keyline inside Cursor when building Figma screens from a brief.

## Open the repo

1. Open the **Figma Graphify / Keyline** repo in Cursor (this workspace).
2. Work on the **box** paths under the Keyline project — do not rely on Mac-only paths for CLI runs.

## Install / build

```bash
npm install
npm run build:server
```

Ensure `package.json` includes a keyline script (or merge from `package-scripts-snippet.json`):

```json
"keyline": "node dist-server/cli.mjs"
```

Then:

```bash
npm run keyline -- --help
```

## Ingest a Figma file

Once per file (or when the design source changes):

```bash
npm run keyline -- ingest '<figma-file-or-design-url>'
```

## Resolve (everyday)

Before placing anything in Figma, resolve masters for a cheap usage card:

```bash
npm run keyline -- resolve "Main Card"
npm run keyline -- resolve "Input Field"
npm run keyline -- resolve "Badge"
```

Use the card + `figmaNodeId`. Prefer **keyline** over any graphify alias.

## Everyday screen flow

1. **Brief** — what screen / states you need
2. **Resolve** — every master you will use
3. **Draw** — `use_figma` / `get_design_context` on those `figmaNodeId`s only
4. **Human taste** — review before expanding scope

**Do not** `Read` `.graphify/graph.json`. Keyline resolve is the cheap path.

## Caps

- Stay at **Level-1** by default
- **Level-2** only when blast radius is large
- Whole-file edits only if you explicitly ask

## Cursor wiring

- Skill: `skills/keyline/SKILL.md`
- Always-on rule: `rules/keyline.mdc`
- Drop into `AGENTS.md`: copy from `AGENTS-KEYLINE-SECTION.md`
