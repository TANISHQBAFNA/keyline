import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { DesignGraphSchema, type DesignGraph } from "@/core/model";
import { SourceDocumentSchema } from "@/core/ingestion/types";
import { adaptFigmaRestFile } from "@/core/ingestion/adapters/figmaRest";
import { adaptFigmaMcpMetadata } from "@/core/ingestion/adapters/figmaMcp";
import {
  fetchFigmaRestDocument,
  figmaAccessToken,
} from "@/core/ingestion/adapters/figmaRestSource";
import { isFigmaLiveTarget, parseFigmaTarget } from "@/core/ingestion/figmaFileKey";
import { buildGraph } from "@/core/transform";
import {
  buildOrientBrief,
  checkFrame,
  componentUsageCard,
  explainNode,
  listRecipes,
  pathBetween,
  queryQuestion,
  recipeCard,
  recommendMasters,
  toGraphReportMarkdown,
  verifyFrame,
} from "@/core/query";
import { deleteGraph, graphIdFor, graphPath, listGraphs, loadRecipes, readLibraryRules, rebuildIndex, resolveGraph, saveGraph, storeRoot } from "./store";

/**
 * Resolve CLI — ingest once into `.graphify/graph.json`.
 *
 * Agents call resolve (usage card), then Figma. Do not Read the graph file.
 */

function usage(): void {
  process.stdout.write(
    [
      "Resolve — Figma rules. Agents resolve.",
      "",
      "  resolve ingest <file.json | figma-url | file-key> [--id <graphId>] [--file-key <key>] [--name <fileName>] [--scope node|screens|file]",
      "      Build a graph and store it. JSON: plugin export, REST body, MCP capture, or a graph.",
      "      Live Figma: pass the shared screen/frame/section URL (node-id in the link).",
      "      No node-id → each top-level screen, one request at a time. --scope file = whole dump.",
      "      Token from FIGMA_ACCESS_TOKEN. Writes .graphify/graph.json — agents call resolve, do not Read that file.",
      "      Re-run ingest to refresh the library before recommend / verify_frame.",
      "",
      "  resolve recipe [list | \"<name or intent>\"] [--id] [--intent \"<brief>\"]",
      "      Screen packs. Overlay .graphify/recipes.json still wins.",
      "      After ingest, list/get bind slots to live masters (or next recommend query).",
      "      Never invents node ids. Unbound: recommend then verify_frame.",
      "  resolve recommend \"<intent>\" [--id] [--budget <chars>]",
      "      Ranked masters: name/intent, variant props, where-used, co-occurrence.",
      "      Live over stale. Deprecated demoted. Cap ~2000 chars. Place returned ids only.",
      "  resolve resolve \"<name>\" [--id] [--budget <chars>]",
      "      Usage card: screens, slot fills, figmaNodeId. When you already know the name.",
      "  resolve verify \"<frame>\" [--id] [--components a,b] [--rules <file>]",
      "      After drawing: pass/fail, invents, deprecated, unresolved. Measures invent rate.",
      "      Optional .graphify/library-rules.json { allow, deny }. Else in-graph + not deprecated = approved.",
      "  resolve orient [--id <graphId>]     Optional god-node summary. Prefer recommend / resolve.",
      "  resolve query \"<question>\" [--id] [--budget <chars>]",
      "      Optional scoped subgraph. Agents should recommend or resolve a component instead.",
      "  resolve path \"<A>\" \"<B>\" [--id]     Shortest relationship path",
      "  resolve explain \"<name>\" [--id]      Bounded markdown brief for one node",
      "  resolve check \"<intent>\" [--id]      Analog variant + deprecated to avoid (prefer recommend)",
      "",
      "  resolve list                 Show the stored graph",
      "  resolve reindex              Confirm graph.json loads",
      "  resolve rm                   Delete graph.json",
      "  resolve where                Print the store location",
      "",
      "  npm run resolve -- <command>     primary",
      "  npm run keyline -- <command>     deprecated alias (one release)",
      "",
    ].join("\n"),
  );
}

function flag(args: string[], name: string): string | undefined {
  const at = args.indexOf(`--${name}`);
  return at >= 0 ? args[at + 1] : undefined;
}

function toGraph(payload: unknown, args: string[]): DesignGraph {
  const asGraph = DesignGraphSchema.safeParse(payload);
  if (asGraph.success) return asGraph.data;

  const asSource = SourceDocumentSchema.safeParse(payload);
  if (asSource.success) return buildGraph(asSource.data);

  const record = (payload ?? {}) as Record<string, unknown>;
  const fileKey = flag(args, "file-key") ?? (record["fileKey"] as string) ?? "local-file";
  const fileName = flag(args, "name") ?? (record["fileName"] as string) ?? "Untitled";

  if (record["metadataXml"] || record["captures"]) {
    return buildGraph(
      adaptFigmaMcpMetadata({
        fileKey,
        fileName,
        metadataXml: record["metadataXml"] as string | undefined,
        variableDefs: record["variableDefs"] as Record<string, unknown> | undefined,
        captures: record["captures"] as never,
      }),
    );
  }

  if (record["document"]) {
    return buildGraph(
      adaptFigmaRestFile({ fileKey, file: payload, variables: record["variables"] }),
    );
  }

  throw new Error(
    "Unrecognised JSON. Expected a plugin export, a Figma REST file body, an MCP capture, or a graph.",
  );
}

function writeStored(graph: DesignGraph, graphId?: string): void {
  const summary = saveGraph(graph, graphId);
  process.stdout.write(
    [
      `Stored ${summary.graphId}`,
      `  file      ${summary.fileName} (${summary.fileKey})`,
      `  source    ${summary.sourceKind}`,
      `  graph     ${summary.nodes} nodes, ${summary.edges} edges`,
      summary.warnings ? `  warnings  ${summary.warnings}` : "",
      `  entry     ${summary.entryPoints.map((entry) => entry.name).join(", ") || "(none)"}`,
      `  graph     ${graphPath()}`,
      "",
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

function ingestScope(args: string[]): "auto" | "node" | "screens" | "file" {
  const named = flag(args, "scope");
  if (named === "node" || named === "screens" || named === "file" || named === "auto") return named;
  if (args.includes("--whole-file")) return "file";
  return "auto";
}

async function ingestLive(target: string, args: string[]): Promise<void> {
  const token = figmaAccessToken();
  if (!token) {
    throw new Error("Set FIGMA_ACCESS_TOKEN to ingest a live Figma file.");
  }
  const parsed = parseFigmaTarget(target);
  const document = await fetchFigmaRestDocument(target, {
    token,
    scope: ingestScope(args),
    onProgress: (info) => {
      if (info.phase === "outline") {
        process.stderr.write(`Outlining ${info.name}\n`);
        return;
      }
      if (info.total <= 1 && info.done === 0) return;
      process.stderr.write(`  ${info.done}/${info.total} ${info.name}\n`);
    },
  });
  const nodeSlug = parsed.nodeIds[0]?.replace(/:/g, "-");
  const graphId =
    flag(args, "id") ??
    (nodeSlug ? graphIdFor(document.fileKey, `${document.fileName}-${nodeSlug}`) : undefined);
  writeStored(buildGraph(document), graphId);
}

function requireGraph(args: string[]) {
  const resolved = resolveGraph(flag(args, "id"));
  if (!resolved) {
    throw new Error(
      "No graph stored. Ingest first (`resolve ingest <figma-url>`). Then call recommend / resolve — do not Read graph.json.",
    );
  }
  return resolved;
}

function positionals(args: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]!;
    if (arg.startsWith("--")) {
      i += 1;
      continue;
    }
    out.push(arg);
  }
  return out;
}

function printJson(value: unknown): void {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

async function main(argv: string[]): Promise<void> {
  const [command, ...args] = argv;

  switch (command) {
    case "ingest": {
      const target = args.find((arg) => !arg.startsWith("--"));
      if (!target) throw new Error("Give a JSON file, Figma URL, or file key.");

      const resolved = resolve(target);
      if (existsSync(resolved)) {
        const payload = JSON.parse(readFileSync(resolved, "utf8"));
        writeStored(toGraph(payload, args), flag(args, "id"));
        return;
      }

      if (isFigmaLiveTarget(target)) {
        await ingestLive(target, args);
        return;
      }

      throw new Error(
        `No file at ${target}. Pass a JSON path, a Figma URL, or a file key (with FIGMA_ACCESS_TOKEN).`,
      );
    }

    case "recipe":
    case "recipes": {
      const query = positionals(args)[0];
      const recipes = loadRecipes();
      if (!query || query === "list") {
        printJson(listRecipes(recipes, resolveGraph(flag(args, "id"))?.index));
        return;
      }
      printJson(
        recipeCard(recipes, query, resolveGraph(flag(args, "id"))?.index, flag(args, "intent")),
      );
      return;
    }

    case "recommend": {
      const intent = positionals(args)[0];
      if (!intent) throw new Error('Usage: resolve recommend "<intent>"');
      const budget = Number(flag(args, "budget"));
      printJson(
        recommendMasters(requireGraph(args).index, intent, {
          budgetChars: Number.isFinite(budget) && budget > 0 ? budget : undefined,
        }),
      );
      return;
    }

    case "resolve": {
      const name = positionals(args)[0];
      if (!name) throw new Error('Usage: resolve resolve "<name>"');
      const budget = Number(flag(args, "budget"));
      printJson(
        componentUsageCard(requireGraph(args).index, name, {
          budgetChars: Number.isFinite(budget) && budget > 0 ? budget : undefined,
        }),
      );
      return;
    }

    case "orient": {
      const { index, graphId } = requireGraph(args);
      const brief = buildOrientBrief(index);
      process.stdout.write(`# ${graphId}\n\n${toGraphReportMarkdown(brief)}`);
      return;
    }

    case "query": {
      const question = positionals(args)[0];
      if (!question) throw new Error('Usage: resolve query "<question>"');
      const budget = Number(flag(args, "budget"));
      const { index } = requireGraph(args);
      printJson(
        queryQuestion(index, question, {
          budgetChars: Number.isFinite(budget) && budget > 0 ? budget : undefined,
        }),
      );
      return;
    }

    case "path": {
      const names = positionals(args);
      const from = names[0];
      const to = names[1];
      if (!from || !to) throw new Error('Usage: resolve path "<A>" "<B>"');
      printJson(pathBetween(requireGraph(args).index, from, to));
      return;
    }

    case "explain": {
      const name = positionals(args)[0];
      if (!name) throw new Error('Usage: resolve explain "<name>"');
      printJson(explainNode(requireGraph(args).index, name));
      return;
    }

    case "check": {
      const intent = positionals(args)[0];
      if (!intent) throw new Error('Usage: resolve check "<intent>"');
      printJson(checkFrame(requireGraph(args).index, intent));
      return;
    }

    case "verify": {
      const frame = positionals(args)[0];
      const componentsRaw = flag(args, "components");
      const components = componentsRaw
        ? componentsRaw
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : undefined;
      if (!frame && !components?.length) {
        throw new Error('Usage: resolve verify "<frame>" [--components a,b] [--rules file]');
      }
      const rulesPath = flag(args, "rules");
      printJson(
        verifyFrame(requireGraph(args).index, {
          frame,
          components,
          rules: readLibraryRules(rulesPath),
        }),
      );
      return;
    }

    case "list": {
      const graphs = listGraphs();
      if (!graphs.length) {
        process.stdout.write(
          "No graphs stored. Run `resolve ingest <file.json>` or `resolve ingest <figma-url>`.\n",
        );
        return;
      }
      for (const entry of graphs) {
        process.stdout.write(
          `${entry.graphId}\n  ${entry.fileName} · ${entry.nodes} nodes · ${entry.edges} edges · ${entry.sourceKind}\n`,
        );
      }
      return;
    }

    case "rm": {
      process.stdout.write(deleteGraph() ? `Deleted ${graphPath()}\n` : "No graph.json stored.\n");
      return;
    }

    case "reindex": {
      const index = rebuildIndex();
      process.stdout.write(
        index.graphs.length ? `Loaded ${graphPath()}\n` : "No graph.json stored.\n",
      );
      return;
    }

    case "where":
      process.stdout.write(`${storeRoot()}\n`);
      return;

    default:
      usage();
  }
}

main(process.argv.slice(2)).catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
