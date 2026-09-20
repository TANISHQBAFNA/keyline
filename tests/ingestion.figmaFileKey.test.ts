import { describe, expect, it } from "vitest";
import {
  isFigmaLiveTarget,
  parseFigmaFileKey,
  parseFigmaTarget,
  toFigmaNodeId,
} from "@/core/ingestion/figmaFileKey";


describe("parseFigmaFileKey", () => {
  it("extracts the key from a design URL", () => {
    expect(
      parseFigmaFileKey(
        "https://www.figma.com/design/DEMOFILEKEY0000000001/Demo-Mobile?node-id=1-2",
      ),
    ).toBe("DEMOFILEKEY0000000001");
  });

  it("accepts file, proto and board URLs", () => {
    expect(parseFigmaFileKey("https://www.figma.com/file/AbCdEfGhIjKlMnOpQrStUv/Name")).toBe(
      "AbCdEfGhIjKlMnOpQrStUv",
    );
    expect(parseFigmaFileKey("https://figma.com/proto/AbCdEfGhIjKlMnOpQrStUv/x")).toBe(
      "AbCdEfGhIjKlMnOpQrStUv",
    );
  });

  it("accepts a bare file key", () => {
    expect(parseFigmaFileKey("DEMOFILEKEY0000000001")).toBe("DEMOFILEKEY0000000001");
  });

  it("rejects empty and junk", () => {
    expect(() => parseFigmaFileKey("")).toThrow(/Give a Figma/);
    expect(() => parseFigmaFileKey("not a url")).toThrow(/Not a Figma/);
  });
});

describe("parseFigmaTarget", () => {
  it("reads node-id from a design URL (hyphens become colons)", () => {
    expect(
      parseFigmaTarget(
        "https://www.figma.com/design/DEMOFILEKEY0000000001/Demo-Mobile?node-id=1-2",
      ),
    ).toEqual({ fileKey: "DEMOFILEKEY0000000001", nodeIds: ["1:2"] });
  });

  it("accepts colon form and proto starting-point-node-id", () => {
    expect(
      parseFigmaTarget("https://www.figma.com/design/DEMOFILEKEY0000000001/x?node-id=1:2"),
    ).toEqual({ fileKey: "DEMOFILEKEY0000000001", nodeIds: ["1:2"] });
    expect(
      parseFigmaTarget(
        "https://www.figma.com/proto/DEMOFILEKEY0000000001/x?starting-point-node-id=3-4",
      ),
    ).toEqual({ fileKey: "DEMOFILEKEY0000000001", nodeIds: ["3:4"] });
  });

  it("leaves a bare file key unscoped", () => {
    expect(parseFigmaTarget("DEMOFILEKEY0000000001")).toEqual({
      fileKey: "DEMOFILEKEY0000000001",
      nodeIds: [],
    });
  });

  it("normalises hyphen node ids", () => {
    expect(toFigmaNodeId("12-34")).toBe("12:34");
  });
});

describe("isFigmaLiveTarget", () => {
  it("treats URLs and bare keys as live, local paths as not", () => {
    expect(isFigmaLiveTarget("https://www.figma.com/design/DEMOFILEKEY0000000001/x")).toBe(true);
    expect(isFigmaLiveTarget("DEMOFILEKEY0000000001")).toBe(true);
    expect(isFigmaLiveTarget("./src/mock/demo-pay.file.json")).toBe(false);
  });
});
