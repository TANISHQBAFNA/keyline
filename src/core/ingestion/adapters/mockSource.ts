import mockFile from "@/mock/demo-pay.file.json";
import mockVariables from "@/mock/demo-pay.variables.json";
import type { IngestionSource, SourceDocument } from "../types";
import { adaptFigmaRestFile } from "./figmaRest";

export const MOCK_FILE_KEY = "DemoPay0000DemoFileKey";

/**
 * The Phase 1 default source: a REST-shaped fixture that goes through exactly
 * the same adapter a live Figma response would.
 */
export class MockIngestionSource implements IngestionSource {
  readonly id = "mock:demo-pay";
  readonly label = "Mock file — Demo Pay (Product)";
  readonly kind = "mock" as const;

  async load(): Promise<SourceDocument> {
    return adaptFigmaRestFile({
      fileKey: MOCK_FILE_KEY,
      file: mockFile,
      variables: mockVariables,
      kind: "mock",
      ingestedAt: new Date().toISOString(),
    });
  }
}

export const mockIngestionSource = new MockIngestionSource();
