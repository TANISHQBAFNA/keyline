import type { IngestionSource } from "@/core/ingestion/types";
import { mockIngestionSource } from "@/core/ingestion/adapters/mockSource";

/** Shown in the picker. Heavy MCP captures load only when selected. */
export const SOURCE_OPTIONS: Array<{ id: string; label: string }> = [
  { id: mockIngestionSource.id, label: mockIngestionSource.label },
  { id: "mcp:demo-mobile-screens", label: "Demo — 2 screens combined (Figma MCP)" },
  { id: "mcp:demo-mobile-portfolio", label: "Demo — Portfolio screen (Figma MCP)" },
];

export const DEFAULT_SOURCE = mockIngestionSource;

export async function resolveSource(id: string): Promise<IngestionSource> {
  if (id === mockIngestionSource.id) return mockIngestionSource;
  const { demoPortfolioSource, demoScreensSource } = await import(
    "@/core/ingestion/adapters/mcpSource"
  );
  if (id === demoScreensSource.id) return demoScreensSource;
  if (id === demoPortfolioSource.id) return demoPortfolioSource;
  throw new Error(`Unknown source: ${id}`);
}
