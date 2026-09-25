import { describe, expect, it } from "vitest";
import {
  parseLibraryRules,
  recommendMasters,
  verifyFrame,
} from "@/core/query";
import { ids, index as demo } from "./fixture";

describe("recommend (library ranking)", () => {
  it("ranks analog masters for an intent without requiring the component name", () => {
    const result = recommendMasters(demo, "create account buttons");
    expect(result.candidates.length).toBeGreaterThan(0);
    expect(result.candidates[0]?.id).toBe(ids.buttonPrimaryLarge);
    expect(result.candidates[0]?.figmaNodeId).toBeTruthy();
    expect(result.candidates[0]?.deprecated).toBe(false);
    expect(result.candidates[0]?.variantProperties?.["Variant"]).toBe("Primary");
    expect(result.cost.chars).toBeLessThan(2000);
    expect(result.hint).toMatch(/Do not Read graph\.json/);
  });

  it("demotes deprecated masters below live ones", () => {
    const result = recommendMasters(demo, "banner message");
    const banner = result.candidates.find((candidate) => candidate.id === ids.banner);
    expect(banner).toBeDefined();
    expect(banner?.deprecated).toBe(true);
    const firstDeprecated = result.candidates.findIndex((candidate) => candidate.deprecated);
    const lastLive = result.candidates.reduce(
      (last, candidate, index) => (candidate.deprecated ? last : index),
      -1,
    );
    if (firstDeprecated >= 0 && lastLive >= 0) {
      expect(lastLive).toBeLessThan(firstDeprecated);
    }
  });

  it("does not recommend invents or non-masters", () => {
    const result = recommendMasters(demo, "quantum flux capacitor widget");
    expect(result.candidates).toEqual([]);
    const live = recommendMasters(demo, "create account buttons");
    for (const candidate of live.candidates) {
      const node = demo.getNode(candidate.id);
      expect(node).toBeDefined();
      expect(["COMPONENT_SET", "MAIN_COMPONENT", "VARIANT"]).toContain(candidate.type);
    }
    expect(live.candidates.some((candidate) => candidate.type === "FRAME")).toBe(false);
  });
});

describe("verify_frame (invent detection)", () => {
  it("passes a frame that only nests live library masters", () => {
    const result = verifyFrame(demo, { frame: "Create account" });
    expect(result.unresolved).toEqual([]);
    expect(result.invents).toEqual([]);
    expect(result.deprecated).toEqual([]);
    expect(result.pass).toBe(true);
    expect(result.approved).toBeGreaterThan(0);
  });

  it("flags proposed names that are not in the graph as invents", () => {
    const result = verifyFrame(demo, { components: ["Button", "MadeUpWidget"] });
    expect(result.pass).toBe(false);
    expect(result.invents.some((hit) => hit.name === "MadeUpWidget" && hit.reason === "not-in-graph")).toBe(
      true,
    );
    expect(result.approved).toBeGreaterThan(0);
  });

  it("flags deprecated masters and unresolved instances", () => {
    const deprecated = verifyFrame(demo, { components: [ids.banner] });
    expect(deprecated.pass).toBe(false);
    expect(deprecated.deprecated).toHaveLength(1);
    expect(deprecated.deprecated[0]?.id).toBe(ids.banner);

    const receipt = verifyFrame(demo, { frame: "Receipt" });
    expect(receipt.pass).toBe(false);
    expect(receipt.unresolved.length).toBeGreaterThan(0);
    expect(receipt.unresolved.every((hit) => hit.reason === "unresolved-instance")).toBe(true);
  });

  it("treats allow/deny rules as the approved set when a rules file is supplied", () => {
    const rules = parseLibraryRules({ allow: ["Button"], deny: ["Card"] });
    const result = verifyFrame(demo, { components: ["Button", "Card"], rules });
    expect(result.pass).toBe(false);
    expect(result.invents.some((hit) => hit.reason === "denied" && hit.name === "Card")).toBe(true);
  });
});
