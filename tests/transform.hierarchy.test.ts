import { describe, expect, it } from "vitest";
import { buildGraph } from "@/core/transform";
import { classifySourceNode } from "@/core/transform/classify";
import { figmaNodeUrl, slugifyFileName } from "@/core/transform/figmaUrl";
import { graph, hasEdge, ids, index, node, sourceDocument, FILE_KEY } from "./fixture";

describe("hierarchy conversion", () => {
  it("creates one FILE root from the DOCUMENT node", () => {
    const file = node(ids.file);
    expect(file.type).toBe("FILE");
    expect(file.name).toBe("Acme Pay — Product");
    expect(file.figmaNodeId).toBe("0:0");
    expect(index.getNodesByType("FILE")).toHaveLength(1);
  });

  it("maps CANVAS to PAGE and hangs every page off the file", () => {
    const pages = index.getPages();
    expect(pages.map((page) => page.name)).toEqual([
      "Cover",
      "Onboarding",
      "Payments",
      "Design System",
    ]);
    for (const page of pages) {
      expect(page.parentId).toBe(ids.file);
      expect(hasEdge("CONTAINS", ids.file, page.id)).toBe(true);
    }
  });

  it("classifies structural node types without looking at names", () => {
    expect(node(ids.sectionSignUp).type).toBe("SECTION");
    expect(node(ids.frameWelcome).type).toBe("FRAME");
    expect(node(ids.groupLegal).type).toBe("GROUP");
    expect(node(ids.textTitle).type).toBe("TEXT_LAYER");
    expect(node(ids.mediaHero).type).toBe("MEDIA_LAYER");
    expect(node(ids.buttonSet).type).toBe("COMPONENT_SET");
    expect(node(ids.card).type).toBe("MAIN_COMPONENT");
    expect(node(ids.buttonPrimaryMedium).type).toBe("VARIANT");
    expect(node(ids.instanceWelcomeButton).type).toBe("COMPONENT_INSTANCE");
  });

  it("treats a nested auto-layout frame as a layout container, not a screen", () => {
    expect(node(ids.autoLayoutForm).type).toBe("AUTO_LAYOUT_CONTAINER");
    expect(node(ids.autoLayoutList).type).toBe("AUTO_LAYOUT_CONTAINER");
    // A top-level frame stays a screen even when it uses auto layout.
    expect(
      classifySourceNode(
        { id: "x", name: "Screen", type: "FRAME", layoutMode: "VERTICAL" },
        { parentGraphType: "PAGE", parentSourceType: "CANVAS" },
      ),
    ).toBe("FRAME");
  });

  it("degrades unknown Figma node types to LAYER instead of failing", () => {
    expect(classifySourceNode({ id: "x", name: "?", type: "SOME_FUTURE_TYPE" })).toBe("LAYER");
  });

  it("stamps page and section onto every descendant", () => {
    const welcome = node(ids.frameWelcome);
    expect(welcome.pageId).toBe(ids.pageOnboarding);
    expect(welcome.sectionId).toBe(ids.sectionSignUp);

    const title = node(ids.textTitle);
    expect(title.pageId).toBe(ids.pageOnboarding);
    expect(title.sectionId).toBe(ids.sectionSignUp);

    // A frame that sits directly on the page has no section.
    expect(node(ids.frameEmptyState).sectionId).toBeUndefined();
  });

  it("emits CONTAINS plus its materialised inverse PARENT_OF", () => {
    expect(hasEdge("CONTAINS", ids.frameWelcome, ids.instanceWelcomeButton)).toBe(true);
    expect(hasEdge("PARENT_OF", ids.instanceWelcomeButton, ids.frameWelcome)).toBe(true);

    const contains = graph.edges.filter((edge) => edge.type === "CONTAINS").length;
    const parentOf = graph.edges.filter((edge) => edge.type === "PARENT_OF").length;
    expect(parentOf).toBe(contains);
  });

  it("carries bounds and a deep link for every Figma node", () => {
    const welcome = node(ids.frameWelcome);
    expect(welcome.bounds).toEqual({ x: 0, y: 0, width: 390, height: 844 });
    expect(welcome.figmaUrl).toBe(
      `https://www.figma.com/design/${FILE_KEY}/Acme-Pay-Product?node-id=10-10`,
    );
  });

  it("builds deep links from any file name", () => {
    expect(slugifyFileName("Acme Pay — Product")).toBe("Acme-Pay-Product");
    expect(slugifyFileName("   ")).toBe("Untitled");
    expect(figmaNodeUrl("KEY", "My File", "1:23", { devMode: true })).toBe(
      "https://www.figma.com/design/KEY/My-File?node-id=1-23&m=dev",
    );
  });

  it("respects the node cap and reports truncation", () => {
    const capped = buildGraph(sourceDocument, { maxNodes: 10, builtAt: "2026-01-01T00:00:00.000Z" });
    expect(capped.nodes.length).toBeLessThanOrEqual(10);
    expect(capped.warnings.some((warning) => warning.code === "SOURCE_TRUNCATED")).toBe(true);
  });

  it("can drop hidden layers on request", () => {
    const kept = buildGraph(sourceDocument, { skipInvisible: true });
    expect(kept.nodes.length).toBeLessThanOrEqual(graph.nodes.length);
  });
});
