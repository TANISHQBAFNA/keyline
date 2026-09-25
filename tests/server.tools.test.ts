import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { TOOLS, callTool } from "@/server/tools";

describe("agent tools", () => {
  const previousHome = process.env["GRAPHIFY_HOME"];

  beforeEach(() => {
    process.env["GRAPHIFY_HOME"] = mkdtempSync(join(tmpdir(), "resolve-tools-"));
  });

  afterEach(() => {
    if (previousHome === undefined) delete process.env["GRAPHIFY_HOME"];
    else process.env["GRAPHIFY_HOME"] = previousHome;
  });

  it("exposes recommend and verify_frame on the same surface as resolve", () => {
    const names = TOOLS.map((tool) => tool.name);
    expect(names).toContain("recommend");
    expect(names).toContain("verify_frame");
    expect(names).toContain("resolve");
    expect(names).toContain("check_frame");
  });

  it("exposes list_recipes and recipe next to recommend", () => {
    const names = TOOLS.map((tool) => tool.name);
    expect(names).toContain("list_recipes");
    expect(names).toContain("recipe");
    expect(names).toContain("get_recipe");
  });

  it("list_recipes returns the starter pack without a stored graph", () => {
    const result = callTool("list_recipes", {}) as { recipes: Array<{ id: string }> };
    expect(result.recipes.some((recipe) => recipe.id === "checkout-summary")).toBe(true);
  });
});
