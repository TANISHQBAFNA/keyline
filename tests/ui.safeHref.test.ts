import { describe, expect, it } from "vitest";
import { safeHref } from "@/ui/safeHref";

describe("safeHref", () => {
  it("keeps http(s) URLs", () => {
    expect(safeHref("https://www.figma.com/design/abc")).toBe("https://www.figma.com/design/abc");
    expect(safeHref("http://localhost:5199/ingest")).toContain("http://");
  });

  it("drops javascript, data, and junk", () => {
    expect(safeHref("javascript:alert(1)")).toBeUndefined();
    expect(safeHref("data:text/html,<script>alert(1)</script>")).toBeUndefined();
    expect(safeHref("not a url")).toBeUndefined();
  });
});
