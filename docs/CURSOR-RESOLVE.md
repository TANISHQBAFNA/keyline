# Cursor + Resolve — how-to

Everyday flow for using Resolve inside Cursor when building Figma screens from a brief.

Tagline: **Figma rules. Agents resolve.**

## Open the repo

1. Open the **Resolve** repo in Cursor (this workspace). GitHub: [`TANISHQBAFNA/resolve`](https://github.com/TANISHQBAFNA/resolve).
2. Work on the **box** paths under the Resolve project — do not rely on Mac-only paths for CLI runs.

## Install / build

Needs Node `^22.12` or `>=24` (Vitest 5). Then:

```bash
npm install
npm run build:server
```

Ensure `package.json` includes a resolve script:

```json
"resolve": "node dist-server/cli.mjs"
```

`keyline` remains a deprecated alias for one release.

Then:

```bash
npm run resolve -- --help
```

## Ingest a Figma file

Once per file (or when the design source changes):

```bash
npm run resolve -- ingest '<figma-file-or-design-url>'
```

## Resolve (everyday)

Before placing anything in Figma, resolve masters for a cheap usage card. The CLI **verb** is `resolve`:

```bash
npm run resolve -- resolve "Main Card"
npm run resolve -- resolve "Input Field"
npm run resolve -- resolve "Badge"
```

Use the card + `figmaNodeId`. Prefer **resolve** over any keyline / graphify alias.

## Everyday screen flow

1. **Brief** — what screen / states you need
2. **Resolve** — every master you will use
3. **Draw** — `use_figma` / `get_design_context` on those `figmaNodeId`s only
4. **Human taste** — review before expanding scope

**Do not** `Read` `.graphify/graph.json`. Resolve is the cheap path.

## Caps

- Stay at **Level-1** by default
- **Level-2** only when blast radius is large
- Whole-file edits only if you explicitly ask

## Cursor wiring

- Skill: `skills/resolve/SKILL.md`
- Always-on rule: `rules/resolve.mdc`
- Drop into `AGENTS.md`: copy from `AGENTS-RESOLVE-SECTION.md`
