import type { IngestionSource, SourceDocument } from "../types";
import { SourceDocumentSchema } from "../types";
import { adaptFigmaRestFile } from "./figmaRest";
import { adaptFigmaMcpMetadata } from "./figmaMcp";

/**
 * Accepts a plugin export, REST file body, or MCP capture JSON.
 */
export class JsonIngestionSource implements IngestionSource {
  readonly kind = "json" as const;

  constructor(
    readonly id: string,
    readonly label: string,
    private readonly payload: unknown,
    private readonly fileKey = "local-json",
    private readonly variables?: unknown,
  ) {}

  async load(): Promise<SourceDocument> {
    const asSourceDocument = SourceDocumentSchema.safeParse(this.payload);
    if (asSourceDocument.success) return asSourceDocument.data;

    const record = (this.payload ?? {}) as Record<string, unknown>;
    if (record["metadataXml"] || record["captures"]) {
      return adaptFigmaMcpMetadata({
        fileKey: (record["fileKey"] as string | undefined) ?? this.fileKey,
        fileName: (record["fileName"] as string | undefined) ?? this.label,
        metadataXml: record["metadataXml"] as string | undefined,
        variableDefs: record["variableDefs"] as Record<string, unknown> | undefined,
        captures: record["captures"] as never,
        kind: "figma-mcp",
      });
    }

    return adaptFigmaRestFile({
      fileKey: this.fileKey,
      file: this.payload,
      variables: this.variables,
      kind: "json",
    });
  }
}
