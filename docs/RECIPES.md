# Screen recipes

A **recipe** is a named pack of library masters that go together for a common screen job — checkout summary, sign-in, empty state, and so on.

Designers still own the library. Agents get a short card with real `figmaNodeId`s and slots, not invented one-offs.

## Who edits what

| You | You do |
|-----|--------|
| **Designer** | Add or edit recipes in JSON. Optionally bind a slot to a master that already exists after ingest. |
| **Agent** | `list_recipes` → `recipe "checkout summary"` → `recommend` any unbound slot → place those ids → `verify_frame`. Never Read `graph.json`. |

Recipes do **not** create components. Never invent a Figma node id.

## After ingest (binding)

When a graph exists, **list** and **get** resolve each slot against live masters:

| Slot status | Meaning |
|-------------|---------|
| **bound** | Overlay/starter `defaultMasterId` is still in the graph and not deprecated. Place that id. |
| **filled** | No stored id (or it was skipped); `recommend` picked a live master. Place that id. |
| **missing** | Stored id is not in the graph. Card includes `nextRecommend`. Do not invent a replacement id. |
| **deprecated** | Stored master is deprecated. Card includes `nextRecommend` for a live stand-in. |
| **unbound** | No live match. Card includes `nextRecommend`. Call `recommend` with that query. |

`.graphify/recipes.json` **still wins** over the starter pack (same `id` replaces). Binding never writes invented ids into the overlay.

You can list recipes with no graph. Slots stay `unbound` and each one still returns `nextRecommend`. Filling ids needs ingest first.

## Files

| File | Role |
|------|------|
| [`src/data/recipes.json`](../src/data/recipes.json) | Starter pack shipped with Resolve (7 common screens). |
| `.graphify/recipes.json` | Your overlay. Same shape. Matching `id` replaces a starter recipe; new ids append. |

## Add a recipe

1. Copy `src/data/recipes.json` to `.graphify/recipes.json`, or create a small overlay that only contains the recipes you are adding.
2. Append an object:

```json
{
  "version": 1,
  "recipes": [
    {
      "id": "promo-banner",
      "title": "Promo banner",
      "intentAliases": ["promo", "campaign strip"],
      "notes": "Optional. Shown on the recipe card.",
      "slots": [
        { "role": "message", "required": true, "hints": ["banner", "message"] },
        { "role": "primary-cta", "required": true, "hints": ["button", "primary"] },
        { "role": "input", "required": false, "hints": ["input"] }
      ]
    }
  ]
}
```

3. Leave `defaultMasterId` off unless that master is already in the ingested graph (graph id, Figma node id, or exact master name). Never invent an id.
4. `hints` are what `recommend` searches. Use words that match your library names (button, input, card, row).

To replace a starter recipe, reuse its `id` (for example `checkout-summary`) in your overlay.

## Try it

```bash
npm run build:server
npm run resolve -- ingest '<figma-url>'
npm run resolve -- recipe list
npm run resolve -- recipe "checkout summary"
npm run resolve -- recommend "checkout primary button"
# draw with returned figmaNodeIds
npm run resolve -- verify "Checkout Summary"
```

MCP: `list_recipes`, `recipe` / `get_recipe` (query = id, title, or intent). After ingest, both bind slots to live masters.
