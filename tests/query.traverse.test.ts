import { describe, expect, it } from "vitest";
import { ids, index } from "./fixture";

describe("graph traversal", () => {
  it("returns the full hierarchy path from file to node", () => {
    expect(index.getHierarchyPath(ids.instanceWelcomeButton).map((node) => node.id)).toEqual([
      ids.file,
      ids.pageOnboarding,
      ids.sectionSignUp,
      ids.frameWelcome,
      ids.instanceWelcomeButton,
    ]);
    expect(index.getAncestors(ids.instanceWelcomeButton)).toHaveLength(4);
  });

  it("walks descendants and can filter by type", () => {
    const instances = index.getDescendants(ids.pageOnboarding, {
      nodeTypes: ["COMPONENT_INSTANCE"],
    });
    expect(instances).toHaveLength(7);

    const shallow = index.getDescendants(ids.pageOnboarding, { maxDepth: 1 });
    expect(shallow.map((node) => node.id).sort()).toEqual(
      [ids.sectionSignUp, ids.frameEmptyState].sort(),
    );
  });

  it("respects the descendant limit", () => {
    expect(index.getDescendants(ids.file, { limit: 5 })).toHaveLength(5);
  });

  it("finds the containing screen frame through nested instances", () => {
    expect(index.getContainingFrame(ids.instanceRowAvatar)?.id).toBe(ids.framePaymentMethods);
    // A component defined on the design system page sits in no frame.
    expect(index.getContainingFrame(ids.instanceCardButtonInComponent)).toBeUndefined();
  });

  it("finds the component definition a node belongs to", () => {
    expect(index.getOwningComponent(ids.instanceCardButtonInComponent)?.id).toBe(ids.card);
    expect(index.getOwningComponent(ids.instanceWelcomeButton)).toBeUndefined();
  });

  it("walks neighbours by edge type and direction", () => {
    const usages = index.getNeighbors(ids.buttonPrimaryMedium, {
      direction: "out",
      edgeTypes: ["USED_IN"],
    });
    expect(usages).toHaveLength(5);
    expect(usages.every((node) => node.isInstance)).toBe(true);

    const twoHops = index.getNeighbors(ids.buttonSet, {
      direction: "out",
      edgeTypes: ["USED_IN", "CONTAINS"],
      depth: 2,
    });
    expect(twoHops.length).toBeGreaterThan(4);
  });

  it("finds the shortest relationship path across edge kinds", () => {
    const toMain = index.shortestPath(ids.instanceWelcomeButton, ids.buttonPrimaryMedium);
    expect(toMain.map((node) => node.id)).toEqual([
      ids.instanceWelcomeButton,
      ids.buttonPrimaryMedium,
    ]);

    const acrossFile = index.shortestPath(ids.frameWelcome, ids.buttonSet);
    expect(acrossFile.length).toBeGreaterThan(2);
    expect(acrossFile[0]?.id).toBe(ids.frameWelcome);
    expect(acrossFile[acrossFile.length - 1]?.id).toBe(ids.buttonSet);
  });

  it("prefers prototype and component edges over page-tree hops", () => {
    const path = index.shortestPath(ids.frameWelcome, ids.frameCreateAccount);
    expect(path.map((node) => node.id)).toEqual([ids.frameWelcome, ids.frameCreateAccount]);
    expect(path.some((node) => node.type === "PAGE" || node.type === "SECTION")).toBe(false);

    const trace = index.shortestPathTrace(ids.frameWelcome, ids.frameCreateAccount);
    expect(trace.hops.map((hop) => hop.type)).toEqual(["PROTOTYPES_TO"]);
  });

  it("returns an empty path when two nodes are unreachable", () => {
    expect(index.shortestPath(ids.file, "node:does-not-exist")).toEqual([]);
  });

  it("returns only edges induced by a node set", () => {
    const scope = new Set<string>([ids.frameWelcome, ids.instanceWelcomeButton]);
    const edges = index.getInducedEdges(scope);
    expect(edges.some((edge) => edge.type === "CONTAINS")).toBe(true);
    expect(edges.every((edge) => scope.has(edge.source) && scope.has(edge.target))).toBe(true);
  });
});
