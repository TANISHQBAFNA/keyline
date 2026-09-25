import { describe, expect, it } from "vitest";
import { TOOLS } from "@/server/tools";

describe("agent tools", () => {
  it("exposes recommend and verify_frame on the same surface as resolve", () => {
    const names = TOOLS.map((tool) => tool.name);
    expect(names).toContain("recommend");
    expect(names).toContain("verify_frame");
    expect(names).toContain("resolve");
    expect(names).toContain("check_frame");
  });
});
