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

Once per file (**re-run when the design library changes** — this is the refresh path):

```bash
npm run resolve -- ingest '<figma-file-or-design-url>'
```

## Recipe → recommend → draw → verify (everyday)

Agent does not need the component name. Cards stay the interface — **do not** `Read` `.graphify/graph.json`.

```bash
npm run resolve -- recipe list
npm run resolve -- recipe "checkout summary"
npm run resolve -- recommend "checkout summary with primary button and input"
npm run resolve -- verify "Checkout Summary"
npm run resolve -- verify --components "Button,MadeUpCard"
```

`recipe` returns ordered slots with `figmaNodeId`s when the library is ingested. Unbound slots include the next `recommend` query. Bound ids that are missing or deprecated are flagged.

Each `recommend` card includes `figmaNodeId`, variant props, where-used, and flags deprecated masters (ranked last). Cap ~2000 chars.

When you already know the master name:

```bash
npm run resolve -- resolve "Main Card"
npm run resolve -- resolve "Input Field"
```

Use the card + `figmaNodeId`. Prefer **resolve** over any keyline / graphify alias.

Optional allow/deny file: `.graphify/library-rules.json` with `{ "allow": [...], "deny": [...] }`. If missing, approved = in-graph master and not deprecated.

Designers add screen packs in JSON — see [`docs/RECIPES.md`](RECIPES.md). Overlay: `.graphify/recipes.json`.

## Everyday screen flow

1. **Ingest** — (refresh) store the library
2. **Recipe** — (optional) named pack for the screen job
3. **Recommend** — unbound slots / free-text brief → ranked masters
4. **Draw** — `use_figma` / `get_design_context` on those `figmaNodeId`s only
5. **Verify** — invents / deprecated / unresolved
6. **Human taste** — review before expanding scope

**Do not** `Read` `.graphify/graph.json`. Resolve cards are the cheap path.

## Caps

- Stay at **Level-1** by default
- **Level-2** only when blast radius is large
- Whole-file edits only if you explicitly ask

## Cursor wiring

- Skill: `skills/resolve/SKILL.md`
- Always-on rule: `rules/resolve.mdc`
- Drop into `AGENTS.md`: copy from `AGENTS-RESOLVE-SECTION.md`
