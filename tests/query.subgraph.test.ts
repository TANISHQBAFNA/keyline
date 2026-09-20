import { describe, expect, it } from "vitest";
import { extractSubgraph, levelForNode } from "@/core/query";
import { ids, index, node } from "./fixture";

type SubgraphOptions = Omit<Parameters<typeof extractSubgraph>[1], "focusId">;

const idsIn = (focusId: string, options: SubgraphOptions = {}) =>
  extractSubgraph(index, { focusId, ...options }).nodes.map((n) => n.id);

describe("level selection", () => {
  it("derives the level from the focused node type", () => {
    expect(levelForNode(node(ids.file))).toBe("PRODUCT_MAP");
    expect(levelForNode(node(ids.pageOnboarding))).toBe("PAGE_MAP");
    expect(levelForNode(node(ids.sectionSignUp))).toBe("PAGE_MAP");
    expect(levelForNode(node(ids.frameWelcome))).toBe("FRAME_COMPOSITION");
    expect(levelForNode(node(ids.instanceWelcomeButton))).toBe("FRAME_COMPOSITION");
    expect(levelForNode(node(ids.buttonSet))).toBe("COMPONENT_DEPENDENCY");
    expect(levelForNode(node(ids.buttonPrimaryMedium))).toBe("COMPONENT_DEPENDENCY");
  });
});

describe("level 1 — product map", () => {
  it("shows the file, pages, sections and top-level frames only", () => {
    const found = idsIn(ids.file);
    expect(found).toContain(ids.file);
    expect(found).toContain(ids.pagePayments);
    expect(found).toContain(ids.sectionCheckout);
    expect(found).toContain(ids.framePaymentMethods);
    expect(found).toContain(ids.buttonSet);
    // Deep layers stay hidden until the user drills in.
    expect(found).not.toContain(ids.textTitle);
    expect(found).not.toContain(ids.instanceWelcomeButton);
  });
});

describe("level 2 — page map", () => {
  it("shows a page's sections, frames and the components they use", () => {
    const found = idsIn(ids.pageOnboarding);
    expect(found).toContain(ids.sectionSignUp);
    expect(found).toContain(ids.frameWelcome);
    expect(found).toContain(ids.frameEmptyState);
    expect(found).toContain(ids.buttonPrimaryMedium);
    expect(found).toContain(ids.card);
    expect(found).not.toContain(ids.textTitle);
  });

  it("keeps the ancestor chain so context is never lost", () => {
    expect(idsIn(ids.pageOnboarding)).toContain(ids.file);
  });

  it("rolls component usage up to the screen so no node floats unconnected", () => {
    const subgraph = extractSubgraph(index, { focusId: ids.pageOnboarding });
    const connected = new Set(subgraph.edges.flatMap((edge) => [edge.source, edge.target]));
    for (const graphNode of subgraph.nodes) {
      expect(connected.has(graphNode.id)).toBe(true);
    }

    const rollup = subgraph.edges.find(
      (edge) => edge.source === ids.buttonPrimaryMedium && edge.target === ids.frameWelcome,
    );
    expect(rollup?.type).toBe("USED_IN");
    expect(rollup?.metadata?.["derived"]).toBe(true);
  });

  it("does not roll usage into the prototype flow view", () => {
    const prototype = extractSubgraph(index, {
      focusId: ids.pageOnboarding,
      viewMode: "prototype",
    });
    expect(prototype.edges.every((edge) => edge.type === "PROTOTYPES_TO")).toBe(true);
  });
});

describe("level 3 — frame composition", () => {
  it("shows children, instances, their main components and foundations", () => {
    const found = idsIn(ids.frameWelcome);
    expect(found).toContain(ids.textTitle);
    expect(found).toContain(ids.instanceWelcomeButton);
    expect(found).toContain(ids.buttonPrimaryMedium);
    expect(found).toContain(ids.buttonSet);
    expect(found).toContain(ids.styleSurface);
    // Prototype destinations keep the flow visible from a screen.
    expect(found).toContain(ids.frameCreateAccount);
  });
});

describe("level 4 — component dependencies", () => {
  it("shows the set, its variants, every instance and where they live", () => {
    const found = idsIn(ids.buttonPrimaryMedium);
    expect(found).toContain(ids.buttonSet);
    expect(found).toContain(ids.buttonDanger);
    expect(found).toContain(ids.instanceWelcomeButton);
    expect(found).toContain(ids.frameWelcome);
    expect(found).toContain(ids.pageOnboarding);
  });

  it("includes the library for a component published elsewhere", () => {
    const found = idsIn(ids.remoteBrandMark);
    expect(found).toContain(ids.libraryUnknown);
    expect(found).toContain(ids.instanceBrandMark);
  });
});

describe("subgraph controls", () => {
  it("expands a node on demand", () => {
    const collapsed = extractSubgraph(index, { focusId: ids.pageOnboarding });
    expect(collapsed.nodes.map((n) => n.id)).not.toContain(ids.textTitle);

    const expanded = extractSubgraph(index, {
      focusId: ids.pageOnboarding,
      expandedIds: [ids.frameWelcome],
    });
    expect(expanded.nodes.map((n) => n.id)).toContain(ids.textTitle);
  });

  it("caps the rendered graph and reports what it hid", () => {
    const capped = extractSubgraph(index, { focusId: ids.file, maxNodes: 6 });
    expect(capped.nodes.length).toBeLessThanOrEqual(6);
    expect(capped.truncated).toBe(true);
    expect(capped.hiddenCount).toBeGreaterThan(0);
  });

  it("only draws edge types the view mode asks for", () => {
    const hierarchy = extractSubgraph(index, { focusId: ids.pageOnboarding, viewMode: "hierarchy" });
    expect(hierarchy.edges.some((edge) => edge.type === "CONTAINS")).toBe(true);
    expect(hierarchy.edges.some((edge) => edge.type === "USES_VARIABLE")).toBe(false);

    const dependency = extractSubgraph(index, {
      focusId: ids.frameWelcome,
      viewMode: "dependency",
    });
    expect(dependency.edges.every((edge) => edge.type !== "CONTAINS")).toBe(true);
    expect(dependency.edges.some((edge) => edge.type === "INSTANCE_OF")).toBe(true);

    const prototype = extractSubgraph(index, { focusId: ids.pageOnboarding, viewMode: "prototype" });
    expect(prototype.edges.every((edge) => edge.type === "PROTOTYPES_TO" || edge.type === "LINKS_TO")).toBe(true);
    expect(prototype.edges.length).toBeGreaterThan(0);
  });

  it("drops nodes with no relationships outside the hierarchy view", () => {
    const dependency = extractSubgraph(index, {
      focusId: ids.frameWelcome,
      viewMode: "dependency",
    });
    const connected = new Set(dependency.edges.flatMap((edge) => [edge.source, edge.target]));
    for (const graphNode of dependency.nodes) {
      expect(connected.has(graphNode.id) || graphNode.id === ids.frameWelcome).toBe(true);
    }
  });

  it("can restrict the subgraph to certain node types", () => {
    const framesOnly = extractSubgraph(index, {
      focusId: ids.file,
      nodeTypeFilter: ["PAGE", "FILE"],
    });
    expect(framesOnly.nodes.every((n) => n.type === "PAGE" || n.type === "FILE")).toBe(true);
  });
});
