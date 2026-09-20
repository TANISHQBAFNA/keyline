/**
 * Accept a Figma URL or a bare file key. Agents paste whatever is in the
 * address bar; humans do too. One parser, both paths.
 *
 * Shared screen / frame / section links carry `node-id` (hyphens in the URL,
 * colons in the API). That id is the ingest scope — not the whole file.
 */
const FILE_KEY_IN_URL =
  /figma\.com\/(?:design|file|board|proto|slides|make)\/(?:branch\/[^/]+\/)?([A-Za-z0-9]+)/i;

const BARE_KEY = /^[A-Za-z0-9]{16,128}$/;

export interface FigmaTarget {
  fileKey: string;
  /** API form (`1:23`). Empty when the URL has no node-id. */
  nodeIds: string[];
}

/** `1-23` in a Figma URL is `1:23` in the REST API. */
export function toFigmaNodeId(raw: string): string {
  return raw.trim().replace(/-/g, ":");
}

function asUrl(input: string): URL | undefined {
  const trimmed = input.trim();
  try {
    if (/^https?:\/\//i.test(trimmed)) return new URL(trimmed);
    if (/figma\.com\//i.test(trimmed)) return new URL(`https://${trimmed.replace(/^\/\//, "")}`);
  } catch {
    return undefined;
  }
  return undefined;
}

export function parseFigmaFileKey(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Give a Figma file URL or file key.");

  const fromUrl = FILE_KEY_IN_URL.exec(trimmed);
  if (fromUrl?.[1]) return fromUrl[1];

  if (BARE_KEY.test(trimmed) && !trimmed.includes("/")) return trimmed;

  throw new Error(`Not a Figma file URL or file key: ${trimmed}`);
}

export function parseFigmaTarget(input: string): FigmaTarget {
  const fileKey = parseFigmaFileKey(input);
  const url = asUrl(input);
  if (!url) return { fileKey, nodeIds: [] };

  const raw = [
    ...url.searchParams.getAll("node-id"),
    ...url.searchParams.getAll("node-id[]"),
    ...url.searchParams.getAll("starting-point-node-id"),
  ].filter(Boolean);

  const seen = new Set<string>();
  const nodeIds: string[] = [];
  for (const value of raw) {
    for (const part of value.split(",")) {
      const id = toFigmaNodeId(part);
      if (!id || seen.has(id)) continue;
      seen.add(id);
      nodeIds.push(id);
    }
  }
  return { fileKey, nodeIds };
}

export function isFigmaLiveTarget(input: string): boolean {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed) || /figma\.com\//i.test(trimmed)) return true;
  return BARE_KEY.test(trimmed);
}
