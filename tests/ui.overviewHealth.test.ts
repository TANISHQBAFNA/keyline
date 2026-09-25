import { describe, expect, it } from "vitest";
import type { GraphAnalytics } from "@/core/query";
import { communityCohesion, libraryHealth } from "@/ui/overview/health";
import { ids, node } from "./fixture";

const emptyAnalytics = (): GraphAnalytics => ({
  totals: {
    nodes: 0,
    edges: 0,
    pages: 0,
    frames: 0,
    componentDefinitions: 0,
    instances: 0,
    styles: 0,
    variables: 0,
  },
  componentUsage: [],
  unusedComponents: [],
  unresolvedInstances: [],
  framesWithoutComponents: [],
  orphanedFrames: [],
  unusedStyles: [],
  unusedVariables: [],
  mostConnected: [],
});

describe("libraryHealth", () => {
  it("is healthy when unused, unresolved, and empty frames are all zero", () => {
    const health = libraryHealth(emptyAnalytics());
    expect(health.tone).toBe("ok");
    expect(health.label).toBe("Healthy");
  });

  it("watches unused components or frames without components", () => {
    const withUnused = libraryHealth({
      ...emptyAnalytics(),
      unusedComponents: [node(ids.buttonDanger)],
    });
    expect(withUnused.tone).toBe("watch");
    expect(withUnused.label).toBe("Watch");
    const withEmpty = libraryHealth({
      ...emptyAnalytics(),
      framesWithoutComponents: [node(ids.frameCover)],
    });
    expect(withEmpty.tone).toBe("watch");
  });

  it("flags unresolved instances as invent risk", () => {
    const health = libraryHealth({
      ...emptyAnalytics(),
      unresolvedInstances: [node(ids.instanceUnresolved)],
    });
    expect(health.tone).toBe("risk");
    expect(health.label).toBe("Invent risk");
  });
});

describe("communityCohesion", () => {
  it("labels tight, linked, and loose clusters", () => {
    expect(communityCohesion(10, 12).label).toBe("Tight");
    expect(communityCohesion(10, 5).label).toBe("Linked");
    expect(communityCohesion(10, 1).label).toBe("Loose");
  });
});
