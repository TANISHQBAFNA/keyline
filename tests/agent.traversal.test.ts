import { describe, expect, it } from "vitest";
import { cbx300ScreensSource } from "@/core/ingestion/adapters/mcpSource";
import { buildGraph } from "@/core/transform";
import {
  computeAnalytics,
  computeComponentUsage,
  indexGraph,
  searchNodes,
  extractSubgraph,
} from "@/core/query";
import { buildAiGraphContext, toMarkdownPrompt } from "@/core/ai";
import capture from "@/data/cbx300-screens.mcp.json";

/**
 * The agent traversal contract.
 *
 * Each test is one question an agent would actually ask, answered the way an
 * agent would answer it: an entry point, then hops through indexes. The
 * assertions pin the answer; the byte counts pin the cost against the
 * alternative, which is re-reading the design payload every single time.
 */

const SOURCE_BYTES = capture.captures.reduce(
  (total, entry) => total + entry.metadataXml.length,
  0,
);

async function load() {
  const index = indexGraph(buildGraph(await cbx300ScreensSource.load()));
  return { index, analytics: computeAnalytics(index) };
}

const size = (value: unknown) => JSON.stringify(value).length;

describe("agent traversal", () => {
  it("step 0 — orient: what is this file, without reading any of it", async () => {
    const { index, analytics } = await load();
    const file = index.getFileNode()!;

    const answer = {
      file: file.name,
      screens: index.getChildren(file.id).map((node) => ({
        id: node.id,
        name: node.name,
        figmaNodeId: node.figmaNodeId,
      })),
      totals: analytics.totals,
    };

    expect(answer.screens).toHaveLength(2);
    expect(answer.totals.componentDefinitions).toBe(20);
    console.log(`STEP0 orient: ${size(answer)}B  (source: ${SOURCE_BYTES}B)`);
  });

  it("step 1 — locate: find a node by name or filter", async () => {
    const { index, analytics } = await load();
    const hits = searchNodes(index, "type:main Input Field", { analytics });

    expect(hits).toHaveLength(1);
    const answer = hits.map((hit) => ({ id: hit.node.id, name: hit.node.name }));
    console.log(`STEP1 locate: ${size(answer)}B`);
  });

  it("step 2 — compose: what is this screen built from", async () => {
    const { index } = await load();
    const screen = index.getNodesByType("FRAME").find((node) => node.name === "Portfolio")!;

    // One hop. NESTS reaches every instance at any depth, so this is not a walk.
    const inventory = new Map<string, number>();
    for (const instance of index.getNestedInstances(screen.id)) {
      const main = index.getMainComponent(instance.id);
      if (main) inventory.set(main.name, (inventory.get(main.name) ?? 0) + 1);
    }

    const answer = [...inventory.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    expect(answer.length).toBeGreaterThan(10);
    expect(answer[0]?.name).toBe("Heading");
    console.log(
      `STEP2 compose: ${size(answer)}B for ${answer.length} components ` +
        `(re-reading the screen: ${capture.captures[0]!.metadataXml.length}B)`,
    );
  });

  it("step 3 — reuse: where else does this component appear", async () => {
    const { index } = await load();
    const component = index
      .getNodesByType("MAIN_COMPONENT")
      .find((node) => node.name === "Input Field")!;

    const usage = computeComponentUsage(index, component);
    const byScreen = new Map<string, number>();
    for (const instance of index.getAllInstancesOf(component.id)) {
      const screen = index.getHierarchyPath(instance.id).find((n) => n.type === "FRAME");
      if (screen) byScreen.set(screen.name, (byScreen.get(screen.name) ?? 0) + 1);
    }

    const answer = {
      component: component.name,
      instances: usage.instanceCount,
      screens: [...byScreen.entries()].map(([name, count]) => ({ name, count })),
      identityIsInferred: component.metadata?.["identity"] === "inferred-from-name",
    };

    expect(answer.instances).toBe(11);
    expect(answer.screens).toHaveLength(2);
    // The agent is told when a link is a name match rather than a real id.
    expect(answer.identityIsInferred).toBe(true);
    console.log(`STEP3 reuse: ${size(answer)}B — ${JSON.stringify(answer.screens)}`);
  });

  it("step 4 — blast radius: what breaks if this changes", async () => {
    const { index } = await load();
    const component = index
      .getNodesByType("MAIN_COMPONENT")
      .find((node) => node.name === "Main Card")!;

    const usage = computeComponentUsage(index, component);
    const answer = {
      component: component.name,
      instances: usage.instanceCount,
      frames: usage.frameIds.map((id) => index.getNode(id)?.name),
      risk: usage.riskScore,
    };

    expect(answer.instances).toBe(13);
    console.log(`STEP4 blast radius: ${size(answer)}B — ${answer.instances} placements`);
  });

  it("step 5 — path: how is this node related to that one", async () => {
    const { index } = await load();
    const screen = index.getNodesByType("FRAME").find((node) => node.name === "Portfolio")!;
    const component = index
      .getNodesByType("MAIN_COMPONENT")
      .find((node) => node.name === "Input Field")!;

    const path = index.shortestPath(screen.id, component.id);
    const answer = path.map((node) => `${node.name} (${node.type})`);

    expect(path.length).toBeGreaterThan(1);
    expect(path[0]?.id).toBe(screen.id);
    expect(path[path.length - 1]?.id).toBe(component.id);
    console.log(`STEP5 path: ${size(answer)}B — ${answer.join(" -> ")}`);
  });

  it("step 6 — expand: pull a bounded neighbourhood, not the file", async () => {
    const { index } = await load();
    const component = index
      .getNodesByType("MAIN_COMPONENT")
      .find((node) => node.name === "Main Card")!;

    const context = buildAiGraphContext(index, component.id, { nodeBudget: 40 })!;
    const prompt = toMarkdownPrompt(context, "Explain this component's dependencies.");

    expect(context.neighbors.length).toBeLessThanOrEqual(40);
    expect(prompt.length).toBeLessThan(SOURCE_BYTES);
    console.log(
      `STEP6 expand: ${prompt.length}B markdown, ${context.neighbors.length + 1} nodes ` +
        `(whole graph: ${size(index.graph)}B)`,
    );
  });

  it("step 7 — drill: pixels for one component, never the screen frame", async () => {
    const { index } = await load();
    const screen = index.getNodesByType("FRAME").find((node) => node.name === "Portfolio")!;
    const instance = index
      .getNestedInstances(screen.id)
      .find((node) => index.getMainComponent(node.id)?.name === "Main Card");

    expect(instance?.figmaNodeId).toBeTruthy();
    expect(instance?.type).toBe("COMPONENT_INSTANCE");
    expect(instance?.figmaNodeId).not.toBe(screen.figmaNodeId);
    console.log(`STEP7 drill: get_design_context(nodeId="${instance!.figmaNodeId}")`);
  });

  it("the whole session costs less than one re-read", async () => {
    const { index, analytics } = await load();
    const screen = index.getNodesByType("FRAME").find((node) => node.name === "Portfolio")!;
    const component = index
      .getNodesByType("MAIN_COMPONENT")
      .find((node) => node.name === "Input Field")!;

    const session = [
      { screens: index.getChildren(index.getFileNode()!.id).map((n) => n.name) },
      searchNodes(index, "type:main Input Field", { analytics }).map((h) => h.node.id),
      index.getNestedInstances(screen.id).length,
      computeComponentUsage(index, component).instanceCount,
      index.shortestPath(screen.id, component.id).map((n) => n.name),
    ];

    const total = size(session);
    console.log(`SESSION total: ${total}B vs one re-read ${SOURCE_BYTES}B`);
    expect(total).toBeLessThan(SOURCE_BYTES);
  });

  it("a subgraph request stays bounded even on the biggest hub", async () => {
    const { index } = await load();
    const file = index.getFileNode()!;
    const subgraph = extractSubgraph(index, { focusId: file.id, maxNodes: 60 });
    expect(subgraph.nodes.length).toBeLessThanOrEqual(60);
  });
});
