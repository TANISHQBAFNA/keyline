import mockFile from "@/mock/acme-pay.file.json";
import mockVariables from "@/mock/acme-pay.variables.json";
import type { IngestionSource, SourceDocument } from "../types";
import { adaptFigmaRestFile } from "./figmaRest";

export const MOCK_FILE_KEY = "AcMePaY0000DemoFileKey";

/**
 * The Phase 1 default source: a REST-shaped fixture that goes through exactly
 * the same adapter a live Figma response would.
 */
export class MockIngestionSource implements IngestionSource {
  readonly id = "mock:acme-pay";
  readonly label = "Mock file — Acme Pay (Product)";
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
