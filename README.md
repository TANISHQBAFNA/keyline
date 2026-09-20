# Keyline

> [github.com/TANISHQBAFNA/keyline](https://github.com/TANISHQBAFNA/keyline)

**Keyline helps your AI (Claude, Cursor, Codex, and similar) use your real Figma components — without pasting the whole file into chat.**

You point it at a screen. It remembers what’s on that screen. Then the AI can ask “where is this button used?” and get a short answer, not a giant dump.

MIT licensed. Free to use.

---

## Who this is for

Designers who work with AI tools and want the AI to respect your existing Figma library — not invent random UI.

You don’t need to be a developer. If you can clone a GitHub repo and paste a Figma link, you’re fine.

---

## What you get

1. **Short answers** — “this component appears on these screens” in a small card  
2. **Safer drawing** — the AI gets the right Figma component id, so it builds from your masters  
3. **Less mess** — the AI should not read the huge saved map file; it should ask Keyline instead  

---

## Install (simple)

### 1. Get the project

```bash
git clone https://github.com/TANISHQBAFNA/keyline.git
cd keyline
npm install
npm run build:server
```

That’s the setup. Do it once on your machine.

### 2. Open it in your AI tool

| Tool | What to do |
|------|------------|
| **Cursor** | Open this folder as a project (or add it to the chat). Use the Keyline skill. |
| **Claude Code** | In this folder, run: `claude --plugin-dir .` |
| **Codex / others** | Open this folder in the tool. It can read `AGENTS.md` and `skills/keyline`. |

### 3. Connect Figma MCP

In Claude, Cursor, or Codex, turn on **Figma MCP** (same way you already connect Figma to that tool).

You do **not** need a Figma personal access token for normal use.

### 4. Use it day to day

1. Paste a link to a **screen or frame** in Figma (not the whole file unless you really want that).  
2. Ask the AI to pull that screen into Keyline (through Figma MCP).  
3. Ask Keyline for each main component you’ll use, for example:

```bash
npm run keyline -- resolve "Component Name"
```

4. Let the AI design using those components.  
5. You review for taste — Keyline is not the taste judge.

**Tip:** Prefer the command name `keyline` if you see an older name like `graphify`.

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
- Cursor-focused steps: [`docs/CURSOR-KEYLINE.md`](docs/CURSOR-KEYLINE.md)  

License: [`LICENSE`](LICENSE) (MIT)

---

## Roadmap (short)

| Now | Next ideas |
|-----|------------|
| Map + search + short AI cards | Clearer reports on design-system usage |
| Works with MCP / plugin | Smoother live Figma links and previews |
| | Optional in-app AI helpers |
