# Figma Graphify — graph export plugin

Reads the open Figma file from inside Figma and writes a `SourceDocument`: the
same normalised shape the REST and MCP adapters produce, so the output loads
into the app with no conversion step.

## Install

1. Figma desktop → **Plugins → Development → Import plugin from manifest…**
2. Pick `figma-plugin/manifest.json` from this repo.
3. Run it from **Plugins → Development → Figma Graphify — Graph Export**.

No build step. `code.js` is plain JavaScript on purpose.

## Why run in-document instead of over MCP or REST

| | REST | MCP `get_metadata` | **Plugin** |
|---|---|---|---|
| Instance → main component | exact `componentId` | ✗ inferred from name | **exact, via `getMainComponentAsync()`** |
| Variables | Enterprise-only endpoint | names only, no ids | **`figma.variables`, no plan gate** |
| Prototype interactions | one transition per node | ✗ none | **every reaction, every trigger** |
| Dev-mode annotations | inconsistent | ✗ none | **`node.annotations`** |
| Auth | personal access token | Figma desktop running | **none** |
| Cost to an agent | whole-file payload | subtree payload | **runs once, exports a graph** |

That last row is the point. An agent should not read a design file to answer a
question about it. Export once, then traverse.

## Output

A single JSON file:

```jsonc
{
  "fileKey": "…",
  "fileName": "…",
  "root": { "type": "DOCUMENT", "children": [ /* pages */ ] },
  "components": { "<nodeId>": { "name": "…", "key": "…", "identity": "id" } },
  "componentSets": { },
  "styles": { },
  "variables": { },
  "variableCollections": { },
  "libraries": { },
  "source": { "kind": "figma-plugin", "ingestedAt": "…" }
}
```

Load it with **Import JSON** in the app header, or programmatically:

```ts
import { JsonIngestionSource } from "@/core/ingestion";

await useGraphStore.getState().loadSource(
  new JsonIngestionSource("plugin:my-file", "My file (plugin)", payload),
);
```

`JsonIngestionSource` validates against `SourceDocumentSchema` first, so a
plugin export skips the adapter layer entirely.

## Scope

- **Current page** — the default. Fast, and usually what you want.
- **Selection only** — one screen or one component set.
- **Whole file** — calls `figma.loadAllPagesAsync()`. Slow on large files; the
  plugin yields to the UI thread every 400 nodes so Figma stays responsive.

## Delivering the export

**Download JSON** writes a file. **POST to a local endpoint** sends it to a
server on your own machine — `manifest.json` allows `localhost` and `127.0.0.1`
and nothing else. A minimal receiver:

```js
// node server.mjs
import { createServer } from "node:http";
import { writeFileSync } from "node:fs";

createServer((request, response) => {
  const chunks = [];
  request.on("data", (chunk) => chunks.push(chunk));
  request.on("end", () => {
    writeFileSync("figma-source.json", Buffer.concat(chunks));
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    response.end("ok");
  });
}).listen(5199);
```

## Limits this plugin does not fix

The plugin API does not name the library a remote component came from either, so
remote entities still group under one `External libraries (source unknown)`
node. Everything else on the REST/MCP gap list is resolved.
