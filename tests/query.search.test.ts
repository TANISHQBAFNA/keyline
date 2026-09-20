import { describe, expect, it } from "vitest";
import {
  applyFilters,
  defaultFilterState,
  isEmptyQuery,
  parseSearchQuery,
  searchNodes,
} from "@/core/query";
import { analytics, ids, index } from "./fixture";

const run = (query: string) => searchNodes(index, query, { analytics });
const idsOf = (query: string) => run(query).map((result) => result.node.id);

describe("query parsing", () => {
  it("splits key:value terms, macros and free text", () => {
    const parsed = parseSearchQuery('type:instance "Pay now" unused-components -is:remote');
    expect(parsed.terms).toEqual([
      { key: "type", value: "instance", negated: false },
      { key: "is", value: "remote", negated: true },
    ]);
    expect(parsed.macros).toEqual(["unused-components"]);
    expect(parsed.text).toEqual(["Pay now"]);
  });

  it("treats unknown keys as free text rather than failing", () => {
    const parsed = parseSearchQuery("colour:blue");
    expect(parsed.terms).toEqual([]);
    expect(parsed.text).toEqual(["colour:blue"]);
  });

  it("knows when a query is empty", () => {
    expect(isEmptyQuery("   ")).toBe(true);
    expect(isEmptyQuery("Button")).toBe(false);
  });
});

describe("search", () => {
  it("matches free text against node names", () => {
    const results = run("Payment methods");
    expect(results[0]?.node.id).toBe(ids.framePaymentMethods);
  });

  it("combines a type filter with free text", () => {
    const results = run("type:instance Button");
    expect(results).toHaveLength(10);
    expect(results.every((result) => result.node.type === "COMPONENT_INSTANCE")).toBe(true);
    expect(results.every((result) => result.node.name.includes("Button"))).toBe(true);
  });

  it("expands type aliases to concrete node types", () => {
    expect(run("type:component").every((r) =>
      ["MAIN_COMPONENT", "VARIANT", "COMPONENT_SET"].includes(r.node.type),
    )).toBe(true);
    expect(run("type:screen").every((r) => r.node.type === "FRAME")).toBe(true);
  });

  it("scopes results to a page", () => {
    const results = run("page:Payments");
    expect(results.length).toBeGreaterThan(5);
    expect(results.every((result) => result.node.pageId === ids.pagePayments)).toBe(true);
  });

  it("finds instances of a component, matching the set name too", () => {
    const results = run("instance-of:Button");
    expect(results).toHaveLength(10);
    expect(results.every((result) => result.node.isInstance)).toBe(true);
  });

  it("finds components used inside a named container", () => {
    const results = idsOf("type:component used-in:Checkout");
    expect(results).toContain(ids.buttonPrimaryMedium);
    expect(results).toContain(ids.card);
    // Nothing on the Checkout section uses the Input component set.
    expect(results).not.toContain(ids.inputSet);
  });

  it("matches variables by name and by resolved type", () => {
    expect(idsOf("type:variable variable:color")).toContain(ids.variableBlue);
    expect(idsOf("variable:radius")).toContain(ids.variableRadius);
  });

  it("supports the is: predicates", () => {
    expect(idsOf("is:remote").sort()).toEqual(
      [ids.remoteBrandMark, ids.instanceBrandMark, ids.styleRemote, ids.libraryUnknown].sort(),
    );
    expect(idsOf("is:unresolved")).toEqual([ids.instanceUnresolved]);
    expect(idsOf("is:unused")).toEqual([ids.banner]);
    expect(idsOf("is:deprecated")).toContain(ids.banner);
    expect(idsOf("deprecated-components")).toEqual([ids.banner]);
  });

  it("negates terms with a leading dash", () => {
    const local = idsOf("type:instance -is:remote");
    expect(local).not.toContain(ids.instanceBrandMark);
    expect(local).toContain(ids.instanceWelcomeButton);
  });

  it("supports health macros", () => {
    expect(idsOf("unused-components")).toEqual([ids.banner]);
    expect(idsOf("unresolved-instances")).toEqual([ids.instanceUnresolved]);
    expect(idsOf("orphaned-frames").sort()).toEqual(
      [ids.frameCover, ids.frameEmptyState, ids.frameUsageGuide].sort(),
    );
    expect(idsOf("frames-without-components")).toHaveLength(3);
  });

  it("ranks an exact name match above a partial one", () => {
    const results = run("Card");
    expect(results[0]?.node.name).toBe("Card");
  });

  it("honours the result limit", () => {
    expect(searchNodes(index, "type:instance", { analytics, limit: 3 })).toHaveLength(3);
  });

  it("matches the name: filter", () => {
    expect(idsOf("name:Banner")).toContain(ids.banner);
  });

  it("scopes results to a section", () => {
    const results = run("section:Checkout");
    expect(results.length).toBeGreaterThan(3);
    expect(results.every((result) => result.node.sectionId === ids.sectionCheckout)).toBe(true);
  });

  it("scopes results to a containing frame", () => {
    expect(idsOf("frame:Welcome")).toContain(ids.instanceWelcomeButton);
    expect(idsOf("frame:Welcome")).not.toContain(ids.instanceVerifyButton);
  });

  it("matches styles and libraries by name", () => {
    expect(idsOf("style:Heading")).toContain(ids.styleHeading);
    expect(idsOf("library:External")).toContain(ids.libraryUnknown);
  });

  it("negates used-in", () => {
    const idsFound = idsOf("type:instance -used-in:Checkout");
    expect(idsFound).toContain(ids.instanceWelcomeButton);
    expect(idsFound).not.toContain(ids.instanceRowAvatar);
  });

  it("treats emoji and regex-like input as literal text", () => {
    expect(() => run("🎉")).not.toThrow();
    expect(run("🎉")).toEqual([]);
    expect(() => run(".*Button")).not.toThrow();
  });
});

describe("filters", () => {
  it("filters by node type", () => {
    const filters = { ...defaultFilterState(), nodeTypes: ["COMPONENT_INSTANCE" as const] };
    expect(applyFilters(index, index.allNodes, filters, analytics)).toHaveLength(26);
  });

  it("filters by origin", () => {
    const remote = applyFilters(
      index,
      index.allNodes,
      { ...defaultFilterState(), origin: "remote" },
      analytics,
    );
    expect(remote.map((node) => node.id).sort()).toEqual(
      [ids.remoteBrandMark, ids.instanceBrandMark, ids.styleRemote, ids.libraryUnknown].sort(),
    );
  });

  it("filters by page", () => {
    const onPage = applyFilters(
      index,
      index.allNodes,
      { ...defaultFilterState(), pageIds: [ids.pageDesignSystem] },
      analytics,
    );
    expect(onPage.every((node) => node.pageId === ids.pageDesignSystem)).toBe(true);
    expect(onPage.some((node) => node.id === ids.buttonSet)).toBe(true);
  });

  it("filters by component scope", () => {
    const mains = applyFilters(
      index,
      index.allNodes,
      { ...defaultFilterState(), componentScope: "main" },
      analytics,
    );
    expect(mains.every((node) => node.isMainComponent)).toBe(true);
  });

  it("filters on design-system health flags", () => {
    const unused = applyFilters(
      index,
      index.allNodes,
      { ...defaultFilterState(), onlyUnusedComponents: true },
      analytics,
    );
    expect(unused.map((node) => node.id)).toEqual([ids.banner]);

    const consumers = applyFilters(
      index,
      index.allNodes,
      { ...defaultFilterState(), onlyDesignSystemConsumers: true },
      analytics,
    );
    expect(consumers.every((node) => node.styleIds?.length || node.variableIds?.length)).toBe(true);
  });

  it("filters to prototype-linked nodes only", () => {
    const linked = applyFilters(
      index,
      index.allNodes,
      { ...defaultFilterState(), onlyPrototypeLinked: true },
      analytics,
    );
    expect(linked.map((node) => node.id)).toContain(ids.frameWelcome);
    expect(linked.map((node) => node.id)).not.toContain(ids.frameEmptyState);
  });
});
