import type { IngestionSource } from "@/core/ingestion/types";
import { mockIngestionSource } from "@/core/ingestion/adapters/mockSource";

/** Shown in the picker. Heavy MCP captures load only when selected. */
export const SOURCE_OPTIONS: Array<{ id: string; label: string }> = [
  { id: mockIngestionSource.id, label: mockIngestionSource.label },
  { id: "mcp:cbx300-screens", label: "CBX300 — 2 screens combined (Figma MCP)" },
  { id: "mcp:cbx300-portfolio", label: "CBX300 — Portfolio screen (Figma MCP)" },
];

export const DEFAULT_SOURCE = mockIngestionSource;

export async function resolveSource(id: string): Promise<IngestionSource> {
  if (id === mockIngestionSource.id) return mockIngestionSource;
  const { cbx300PortfolioSource, cbx300ScreensSource } = await import(
    "@/core/ingestion/adapters/mcpSource"
  );
  if (id === cbx300ScreensSource.id) return cbx300ScreensSource;
  if (id === cbx300PortfolioSource.id) return cbx300PortfolioSource;
  throw new Error(`Unknown source: ${id}`);
}
