import capturedPortfolio from "@/data/demo-mobile-portfolio.mcp.json";
import capturedScreens from "@/data/demo-mobile-screens.mcp.json";
import type { IngestionSource, SourceDocument } from "../types";
import { adaptFigmaMcpMetadata } from "./figmaMcp";

/**
 * A Figma file, captured through the Dev Mode MCP server.
 *
 * The capture is stored verbatim (the raw `get_metadata` XML and the raw
 * `get_variable_defs` map) rather than pre-parsed, so the adapter under test is
 * the same code path a live MCP call would take.
 */
interface StoredCapture {
  fileKey: string;
  fileName: string;
  capturedAt?: string;
  /** Single-frame capture. */
  metadataXml?: string;
  variableDefs?: Record<string, unknown>;
  /** Multi-frame capture: one entry per `get_metadata` call. */
  captures?: Array<{
    nodeId?: string;
    name?: string;
    metadataXml: string;
    variableDefs?: Record<string, unknown>;
  }>;
}

export class CapturedMcpIngestionSource implements IngestionSource {
  readonly kind = "figma-mcp" as const;

  constructor(
    readonly id: string,
    readonly label: string,
    private readonly capture: StoredCapture,
  ) {}

  async load(): Promise<SourceDocument> {
    return adaptFigmaMcpMetadata({
      fileKey: this.capture.fileKey,
      fileName: this.capture.fileName,
      metadataXml: this.capture.metadataXml,
      variableDefs: this.capture.variableDefs,
      captures: this.capture.captures,
      ingestedAt: this.capture.capturedAt,
    });
  }
}

export const demoPortfolioSource = new CapturedMcpIngestionSource(
  "mcp:demo-mobile-portfolio",
  "Demo — Portfolio screen (Figma MCP)",
  capturedPortfolio,
);

export const demoScreensSource = new CapturedMcpIngestionSource(
  "mcp:demo-mobile-screens",
  "Demo — 2 screens combined (Figma MCP)",
  capturedScreens,
);
