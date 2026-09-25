# Screen recipes

A **recipe** is a named pack of library masters that go together for a common screen job — checkout summary, sign-in, empty state, and so on.

Designers still own the library. Agents get a short card with real `figmaNodeId`s and slots, not invented one-offs.

## Who edits what

| You | You do |
|-----|--------|
| **Designer** | Add or edit recipes in JSON. Optionally bind a slot to a master that already exists after ingest. |
| **Agent** | `list_recipes` → `recipe "checkout summary"` → `recommend` any unbound slot → place those ids → `verify_frame`. Never Read `graph.json`. |

Recipes do **not** create components. Empty slots stay unbound until `recommend` fills them from the ingested graph.

## Files

| File | Role |
|------|------|
| [`src/data/recipes.json`](../src/data/recipes.json) | Starter pack shipped with Resolve (7 common screens). |
| `.graphify/recipes.json` | Your overlay. Same shape. Matching `id` replaces a starter recipe; new ids append. |

You do not need a graph file to *list* recipes. Filling slots with ids needs an ingest first.

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

MCP: `list_recipes`, `recipe` / `get_recipe` (query = id, title, or intent).
