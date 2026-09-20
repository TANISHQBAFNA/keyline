import { describe, expect, it } from "vitest";
import { computeComponentUsage } from "@/core/query";
import { analytics, ids, index } from "./fixture";

describe("reverse indexes", () => {
  it("indexes instances by main component", () => {
    expect(index.getInstancesOf(ids.buttonPrimaryMedium)).toHaveLength(5);
    expect(index.getInstancesOf(ids.avatar)).toHaveLength(7);
    expect(index.getInstancesOf(ids.card)).toHaveLength(3);
    expect(index.getInstancesOf(ids.banner)).toHaveLength(0);
  });

  it("rolls variant usage up to the component set", () => {
    // 5 + 1 + 3 + 1 across the four Button variants.
    expect(index.getAllInstancesOf(ids.buttonSet)).toHaveLength(10);
    expect(index.getAllInstancesOf(ids.inputSet)).toHaveLength(2);
  });

  it("indexes style and variable consumers", () => {
    expect(index.getStyleConsumers(ids.styleHeading)).toHaveLength(3);
    expect(index.getVariableConsumers(ids.variableSpace4)).toHaveLength(3);
    // Both semantic colours alias the same primitive.
    expect(index.getVariableConsumers(ids.variableBlue)).toHaveLength(2);
  });

  it("indexes nodes by type", () => {
    expect(index.getNodesByType("COMPONENT_INSTANCE")).toHaveLength(26);
    expect(index.getNodesByType("PAGE")).toHaveLength(4);
    expect(index.getNodesByType("FRAME")).toHaveLength(9);
    expect(index.getNodesByType("VARIANT")).toHaveLength(6);
    expect(index.getNodesByType("STYLE")).toHaveLength(7);
    expect(index.getNodesByType("VARIABLE")).toHaveLength(6);
    expect(index.getNodesByType("VARIABLE_COLLECTION")).toHaveLength(2);
    expect(index.getNodesByType("EXTERNAL_LIBRARY")).toHaveLength(1);
  });

  it("indexes nodes by page", () => {
    const onPage = index.getNodesOnPage(ids.pageOnboarding);
    expect(onPage.every((node) => node.pageId === ids.pageOnboarding)).toBe(true);
    expect(onPage.some((node) => node.id === ids.textTitle)).toBe(true);
  });

  it("indexes library membership", () => {
    const members = index.getLibraryMembers(ids.libraryUnknown).map((node) => node.id);
    expect(members).toContain(ids.remoteBrandMark);
    expect(members).toContain(ids.styleRemote);
  });
});

describe("analytics", () => {
  it("ranks components by usage", () => {
    expect(analytics.componentUsage[0]?.component.id).toBe(ids.buttonSet);
    expect(analytics.componentUsage[0]?.instanceCount).toBe(10);
  });

  it("finds components with no instances", () => {
    expect(analytics.unusedComponents.map((node) => node.id)).toEqual([ids.banner]);
  });

  it("finds instances whose main component is missing", () => {
    expect(analytics.unresolvedInstances.map((node) => node.id)).toEqual([ids.instanceUnresolved]);
  });

  it("finds frames with no component usage", () => {
    expect(analytics.framesWithoutComponents.map((node) => node.id).sort()).toEqual(
      [ids.frameCover, ids.frameEmptyState, ids.frameUsageGuide].sort(),
    );
  });

  it("finds orphaned screens — no components and no prototype links", () => {
    expect(analytics.orphanedFrames.map((node) => node.id).sort()).toEqual(
      [ids.frameCover, ids.frameEmptyState, ids.frameUsageGuide].sort(),
    );
  });

  it("computes blast radius for a component", () => {
    const usage = computeComponentUsage(index, index.getNode(ids.avatar)!);
    expect(usage.instanceCount).toBe(7);
    expect(usage.pageIds.sort()).toEqual(
      [ids.pageOnboarding, ids.pagePayments, ids.pageDesignSystem].sort(),
    );
    expect(usage.riskScore).toBeGreaterThan(0);
  });

  it("counts the file at a glance", () => {
    expect(analytics.totals).toMatchObject({
      pages: 4,
      frames: 9,
      instances: 26,
      componentDefinitions: 7,
      styles: 7,
      variables: 6,
    });
  });
});
