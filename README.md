# Resolve

> Figma rules. Agents resolve.

> [github.com/TANISHQBAFNA/resolve](https://github.com/TANISHQBAFNA/resolve)

**You set the design rules. AI builds inside them — faster and more accurately.**

The real power of Resolve: a human designer defines the UI guidelines, components, and usage scope. AI tools (Claude, Cursor, Codex, and similar) use that map to create screens without inventing a new system every time.

**The loop**

1. **You** set rules, guidelines, and what may be used  
2. **Resolve** holds the map of your Figma library  
3. **AI** asks Resolve what to reuse (`recommend`), then drafts from those masters  
4. **Resolve** checks the draft (`verify_frame`) so invent rate is visible  
5. **You** judge taste  

So Resolve is not “AI that designs.” It is **your rules, made easy for AI to follow** — without pasting the whole Figma file into chat.

MIT licensed. Free to use.

---

## Who this is for

Designers who work with AI and want the AI to respect their library and guidelines — not invent random UI.

You don’t need to be a developer. If you can clone a GitHub repo and paste a Figma link, you’re fine.

---

## What you get

1. **Your rules in charge** — AI works from your components and usage scope  
2. **Faster screen drafts** — less guessing, more reuse  
3. **Short answers** — “what is this / where is it used?” in a small card, not a giant dump  
4. **Safer drawing** — AI gets the right Figma component id for your masters  
5. **Measurable reuse** — `recommend` ranks library masters from a brief; `verify_frame` flags invents  

---

## Install (simple)

### 1. Get the project

Needs Node 22.12 or newer.

```bash
git clone https://github.com/TANISHQBAFNA/resolve.git
cd resolve
npm install
npm run build:server
```

That’s the setup. Do it once on your machine.

### 2. Open it in your AI tool

| Tool | What to do |
|------|------------|
| **Cursor** | Open this folder as a project (or add it to the chat). Use the Resolve skill. |
| **Claude Code** | In this folder, run: `claude --plugin-dir .` |
| **Codex / others** | Open this folder in the tool. It can read `AGENTS.md` and `skills/resolve`. |

### 3. Connect Figma MCP

In Claude, Cursor, or Codex, turn on **Figma MCP** (same way you already connect Figma to that tool).

You do **not** need a Figma personal access token for normal use.

### 4. Use it day to day

1. Paste a link to a **screen or frame** in Figma (not the whole file unless you really want that).  
2. Ask the AI to pull that screen into Resolve (through Figma MCP). Re-ingest when the library changes.  
3. Ask Resolve what to reuse from a brief, then optionally confirm a named master:

```bash
npm run resolve -- recommend "checkout summary with primary button"
npm run resolve -- resolve "Component Name"
npm run resolve -- verify "Checkout Summary"
```

4. Let the AI design using those components (`figmaNodeId` from the card).  
5. You review for taste — Resolve is not the taste judge. `verify_frame` only checks library reuse.

**Tip:** Prefer the command name `resolve` if you see an older name like `keyline` or `graphify`. `npm run keyline` still works as a deprecated alias for this release.

---

## Optional: look at the graph yourself

If you want to click around the map in a browser:

```bash
npm run dev
```

Sample data loads with no login. Handy for demos and learning.

---

## Other ways to bring a file in (optional)

Most designers should use **Figma MCP** only.

| Way | When |
|-----|------|
| **Figma MCP** | Default — Claude / Cursor / Codex |
| **Figma plugin** in this repo | If you want to export from Figma by hand |
| **Saved JSON** | If someone already exported a capture for you |

---

## For people who like detail

- Architecture notes: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)  
- How tools plug in: [`docs/INTEGRATIONS.md`](docs/INTEGRATIONS.md)  
- Cursor-focused steps: [`docs/CURSOR-RESOLVE.md`](docs/CURSOR-RESOLVE.md)  
- Toolchain versions (Vite 8, React 19, Vitest 5): [`CHANGELOG.md`](CHANGELOG.md) 

License: [`LICENSE`](LICENSE) (MIT)

---

## Roadmap (short)

| Now | Next ideas |
|-----|------|
| Map + search + short AI cards | Clearer reports on design-system usage |
| `recommend` + `verify_frame` (invent rate) | Screen recipes (ordered masters + slots) |
| Works with MCP / plugin | Smoother live Figma links and previews |
| | Optional in-app AI helpers |
