# Resolve — how to use it

**Figma rules. Agents resolve.**

This is the guide to start with if you set Figma library rules and want AI agents to pick the right components.

You do not need to read the code. You need a Figma library, a short list of screen packs, and (when one library serves more than one product) a context pack that says *this product* and *this step in the journey*.

---

## What Resolve is

Resolve is one shared **design system brain** for your Figma library.

You already have main components in Figma — a Primary button, an Input, a checkout card. Agents are good at drawing screens. They are also good at inventing a new button every time.

Resolve’s job is to make the agent **ask first, then place a real library component**. It does not replace Figma. It does not judge taste. You still review the screen.

Think of it as a map of what already exists, plus a few rules you write in plain files, plus a checker after the draft.

---

## Who it is for

**You (designer or product).** You decide which masters may be used, which screen jobs exist (checkout summary, sign-in, empty state), and — if several products share one library — which product and journey step this screen belongs to.

**The AI agent.** It builds the screen in Figma. It must use the component ids Resolve returns. It must not invent a new system.

If you can paste a Figma link and copy a small JSON file, you can run this.

---

## What you need

- A **Figma library or file** (a shared screen or frame link is enough to start — you do not have to dump the whole file).
- **Resolve** on your machine, *or* an AI tool (Cursor, Claude, Codex, and similar) with Resolve connected.
- **Figma connected** in that same AI tool (the usual Figma connection — you do not need a Figma personal access token for everyday use).

Do the install once:

```bash
git clone https://github.com/TANISHQBAFNA/resolve.git
cd resolve
npm install
npm run build:server
```

That needs Node 22.12 or newer. Then open this folder in your AI tool and turn on Figma.

For clone flags, tokens, and the optional browser map, see [For developers](../README.md#for-developers) in the README.

---

## Core ideas (plain words)

**Master.** The main component in your library — the source of truth, not a one-off copy on a screen. Example: the Primary button in the Button set.

**Ingest.** Refresh Resolve’s knowledge from Figma. Do this when the library is new to Resolve, and **again whenever the library changes**. Until you ingest, Resolve cannot point at live components.

**Recipe (screen pack).** A named shopping list for a common screen job. “Checkout summary” might need a header, a line list, a Primary button, and an optional input. Resolve ships seven starters (checkout summary, settings form, empty state, list and detail, sign-in, confirm dialog, nav and content shell). You can add your own.

**Context pack.** A note that says *this product* + *this journey step* (and who it is for). Shared libraries often have two Primary buttons that look alike. A context pack helps Resolve pick the Storefront checkout one, not the admin settings one.

**Recommend.** You (or the agent) ask in ordinary language — “checkout with primary button” — and get back a short ranked list of **live** masters, each with a Figma component id to place. An empty list means “do not invent.”

**Verify.** After the draft, Resolve checks the frame. It flags pieces that were invented, pieces marked retired in the library, and pieces it cannot match. It does **not** say the layout is beautiful. That is still you.

**Figma component id.** The address of that master in your file. Agents place that exact component. They must not make up an id.

---

## Happy path (what you do, what you get)

Use a checkout summary as the running example. Swap the words for your screen.

### 1. Refresh the library (ingest)

Paste a **screen or frame** link, not the whole file unless you really want that.

```bash
npm run resolve -- ingest 'https://www.figma.com/design/…?node-id=…'
```

Or ask the agent: “Ingest this Figma frame into Resolve.”

**You get:** Resolve now knows the masters in that file. If ingest fails on a live `figma.com` link from the command line, you need a Figma access token, or ingest through the Figma connection / plugin export instead (see troubleshooting).

Re-run this step after you add, rename, or retire components in Figma.

### 2. See the screen packs (recipes)

```bash
npm run resolve -- recipe list
npm run resolve -- recipe "checkout summary"
```

**You get:** A short card for Checkout summary. Each **slot** (header, line list, primary button, optional input) is either:

- already matched to a live master, with a Figma component id to place, or
- still open, with a suggested next ask for recommend.

After ingest, slots try to match real library masters. They never invent an id.

### 3. Ask for the right master (recommend)

For every slot that is still open, missing, or pointing at a retired master:

```bash
npm run resolve -- recommend "checkout with primary button"
```

If you wrote a context pack (below), you can name it:

```bash
npm run resolve -- recommend "primary button" --pack storefront-checkout-summary
```

Or skip the pack name and say which **product**, which **journey step**, and which **domain** (the area of the product — checkout, settings, onboarding) this screen is for:

```bash
npm run resolve -- recommend "primary button" --product Storefront --journey summary --domain checkout
```

`recipe` and `verify` take the same extras, so ranking and the after-draw check follow the same product and step.

**You get:** A short ranked list. Live, used masters rise. Retired ones sink. Product, journey, and domain words sit **on top of** name matching — so “Primary button” in a Storefront checkout pack prefers the checkout Primary, not a random cousin.

If the list is empty: **do not invent a component.** Change the words (use names from your library), re-ingest, or pick a different pack.

### 4. Place only those components

The agent draws in Figma using **only** the Figma component ids from the recipe and recommend cards.

It must not invent a new “Primary button.” It must not paste the whole library into chat. It must not guess an id.

### 5. Check the draft (verify)

```bash
npm run resolve -- verify "Checkout Summary"
```

You can also pass the names it placed:

```bash
npm run resolve -- verify --components "Button,MadeUpCard"
```

To apply the same product and step as recommend (including a pack’s deny list):

```bash
npm run resolve -- verify "Checkout Summary" --product Storefront --journey summary --domain checkout
```

**You get:** Pass or fail. Invented names (like `MadeUpCard`) fail. Retired masters fail. Pieces Resolve cannot match fail. You then judge taste in Figma.

### 6. You review

Resolve is not the taste judge. If the Primary button is the right master but the spacing is wrong, that is a Figma note for the agent — not a Resolve bug.

---

## If you use an AI tool (short)

When Resolve is connected, the agent can call the same steps by name:

| Name | What it does |
|------|----------------|
| `list_recipes` | List screen packs |
| `recipe` | Get one pack (for example `"checkout summary"`) |
| `recommend` | Rank live masters for a brief; you can name a pack, or the product, journey step, and domain |
| `resolve` | Look up a master you already know by name (for example `"Main Card"`) |
| `verify_frame` | Check the drawn frame or the placed names; same optional pack / product / journey / domain |

On the Figma side, the agent may open a component **only after** one of those cards returned its id. Everyday names for that are `use_figma` and `get_design_context`.

You do not need to memorize this table. If the agent follows this repo’s Resolve instructions, it already has the order: ingest → recipe → recommend open slots → place returned ids → verify.

---

## How to write a context pack

Use this when **one Figma library serves more than one product**, or when a generic name like “Primary button” is not enough.

### Copy the example

1. Copy [`src/data/context-packs.example.json`](../src/data/context-packs.example.json) to **`.graphify/context-packs.json`**.
2. Edit that new file. Leave the example in `src/data/` as a template — Resolve does **not** load the example until you copy it.
3. **Never add Figma component ids** to a context pack. Recommend fills those after ingest.

A filled-in file looks like this:

```json
{
  "version": 1,
  "active": "storefront-checkout-summary",
  "packs": [
    {
      "id": "storefront-checkout-summary",
      "product": { "id": "storefront", "name": "Storefront" },
      "domain": "checkout",
      "journey": { "step": "summary", "screenJob": "checkout summary" },
      "audience": "returning shopper",
      "constraints": { "density": "compact", "a11y": "wcag-aa" },
      "recipeIds": ["checkout-summary"],
      "libraryRules": { "deny": ["Banner"] }
    }
  ]
}
```

### What each line means

**`active`.** The pack agents should load by default when you do not name one. Here: Storefront checkout summary.

**`id`.** A stable name you choose for this pack. Use it with `--pack storefront-checkout-summary`. Keep it unique.

**`product`.** Which product this screen is for. You can write `{ "id": "storefront", "name": "Storefront" }` or a plain string `"Storefront"`. This is how Resolve prefers Storefront checkout pieces over another product that shares the same library.

**`domain`.** The area of the product, in everyday words — `checkout`, `onboarding`, `settings`.

**`journey`.** Where you are in the flow. `step` is the short label (`summary`). `screenJob` is the screen you are building (`checkout summary`) — the same kind of phrase you pass to `recipe`. You can also set `journey` to a single string like `"summary"`.

**`audience`.** Who the screen is for, in a phrase (`returning shopper`). This becomes extra context for ranking. It is not a separate audience tool.

**`constraints`.** Extra wishes in words — how dense the layout should feel (`compact`), and the accessibility bar you care about (`wcag-aa`). These help ranking. They do not run an accessibility audit.

**`recipeIds`.** Which screen packs this context applies to. Use the recipe **id**, not the title: `checkout-summary`, not `"Checkout Summary"`. This is the usual way to bind a pack. One file can list several recipes if they share the same product and journey.

**`libraryRules` (optional).** A small allow / deny list of **component names**. `"deny": ["Banner"]` means “do not pick Banner for this pack.” Same idea as the optional `.graphify/library-rules.json` file.

Unknown extra keys are ignored. Invented Figma ids in this file are ignored. That is on purpose — this file is for product and journey, not for drawing.

---

## How to bind packs to recipes

Resolve needs to know *which pack goes with which screen job*. First match wins:

1. **You name the pack** — `--pack storefront-checkout-summary` (or the same `pack` field in the AI tool).
2. **The recipe names a pack** — `"contextPackId": "storefront-checkout-summary"` on the recipe. Prefer putting `recipeIds` on the pack instead, so one product/journey file owns the bind.
3. **The pack lists the recipe** — `"recipeIds": ["checkout-summary"]`. This is the usual designer path.
4. **You pass product / journey / domain** — `--product Storefront --journey summary --domain checkout` (or the same fields in the AI tool). Resolve picks the best matching pack.
5. **The file’s `active` pack** — used when it lists this recipe, or when it lists none.

Recommend uses the same pack (or the active pack, or the product / journey / domain flags) **on top of** its usual ranking: name, variants, where it is already used, live over stale, retired last.

You can add or replace screen packs in `.graphify/recipes.json`. Matching `id` replaces a starter. Leave the stored Figma id off a slot unless that master is already in the ingested library. Details and a copy-paste recipe live in [Screen recipes](RECIPES.md).

---

## Rules agents must follow

These are the rules you should expect every agent to obey. If it breaks them, stop and point it back here.

1. **Place only returned ids.** Use the Figma component ids from recipe, recommend, or a named lookup. Never invent a component, a name, or an id.
2. **Never dump the whole file.** Do not paste the stored library map, a giant Figma export, or the whole page tree into chat. Short cards are the point.
3. **Do not open a whole frame in Figma as a “design system”** until a card returned that frame’s id. Agents draw with masters, not by cloning a random section.
4. **Re-ingest when the library changes.** Stale knowledge is how you get missing or retired masters.
5. **Empty recommend means stop.** Do not “helpfully” draw a new button.
6. **Verify after the draft.** Invented, retired, and unmatched pieces must be visible.
7. **You still own taste.** Spacing, copy, and whether the screen feels right stay human.

Optional allow / deny for the whole library: `.graphify/library-rules.json` with `{ "allow": ["Button"], "deny": ["Banner"] }`. If that file is missing, “approved” means: it is in the ingested library, and it is not retired.

---

## What Resolve does not do yet

Be honest with yourself and with agents:

- **Not a Figma replacement.** You still design, comment, and ship in Figma.
- **Not a multi-file design-system workspace yet.** It does not yet report “you used the wrong cousin from another product that shares this library.” That check is coming. Today, context packs plus deny lists are the lever you have.
- **Not a designer UI for “why this component.”** You do not yet get a visual card that explains the pick. Ranking still happens; the explanation UI is coming.
- **Does not create components.** Recipes and packs only point at masters that already exist.
- **Does not stay live by itself.** Changing Figma does nothing until you ingest again.

---

## Troubleshooting

**Recommend comes back empty.** The library was not ingested, the words do not match any master, or the live matches are all retired. Re-ingest. Use names from your library (“Primary button”, not “CTA widget”). Do not invent a fallback.

**The context pack does not seem to apply.** The file must live at `.graphify/context-packs.json` — the example under `src/data/` is only a template. `recipeIds` must be the recipe id (`checkout-summary`). Set `active`, or pass `--pack`, or pass the product, journey step, and domain. Then run `recipe "checkout summary"` again and look for the product and journey on the card.

**Picks feel stale after a library change.** Re-run ingest. That is the refresh path. There is no silent live sync.

**Verify says something was invented.** The agent placed a name that is not a library master (or not in this ingest). Run recommend again and place the returned id.

**Verify says retired or unresolved.** That master is marked don’t-use, or Resolve cannot match it in the current ingest. Recommend a live stand-in. Re-ingest if you just renamed it in Figma.

**Command-line ingest of a figma.com URL fails.** Live ingest from the command line needs `FIGMA_ACCESS_TOKEN`. Everyday use is: Figma connected in the AI tool, or a JSON export from the Figma plugin in this repo. You do **not** need a token for that everyday path.

**“No graph stored.”** Ingest first. Recipe list can run with no library (slots stay open); recommend and verify cannot.

**Older command names.** Prefer `resolve`. `keyline` still works as a short-term alias.

---

## Where to go next

- **You are a designer using Resolve** — you are in the right file. Keep this tab.
- **You want to add or replace a screen pack** — [Screen recipes](RECIPES.md) (JSON details under a short plain-English intro).
- **You work mainly in Cursor** — [Cursor + Resolve](CURSOR-RESOLVE.md) is the same happy path with editor wiring.
- **You are building Resolve itself** — [Architecture](ARCHITECTURE.md) and [Integrations](INTEGRATIONS.md).
