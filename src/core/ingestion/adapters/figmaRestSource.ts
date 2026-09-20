import type { IngestionSource, SourceDocument } from "../types";
import { parseFigmaTarget } from "../figmaFileKey";
import {
  collectTopLevelScreens,
  fileFromNodesResponse,
  resolveIngestScope,
  type FigmaIngestScope,
  type ScreenRef,
} from "../figmaScope";
import { adaptFigmaRestFile } from "./figmaRest";

/**
 * Live Figma REST ingest. Parsing stays in `adaptFigmaRestFile`; this file
 * only fetches.
 *
 * Default scope is the shared node (`?node-id=`), not the whole file. Whole
 * files walk top-level FRAME/SECTION nodes one at a time.
 *
 * Token never lives in the bundle. Browser sends it per-request through the
 * Vite `/api/figma` proxy (CORS). Node/CLI reads `FIGMA_ACCESS_TOKEN`.
 */

export const FIGMA_API_ORIGIN = "https://api.figma.com";

export function figmaApiOrigin(): string {
  return typeof window === "undefined" ? FIGMA_API_ORIGIN : "/api/figma";
}

export function figmaAccessToken(): string | undefined {
  const env = typeof process === "undefined" ? undefined : process.env;
  const token = env?.["FIGMA_ACCESS_TOKEN"] ?? env?.["FIGMA_TOKEN"];
  return token?.trim() || undefined;
}

export interface IngestProgress {
  phase: "outline" | "screen" | "file";
  done: number;
  total: number;
  name: string;
}

export interface FetchFigmaRestOptions {
  token: string;
  signal?: AbortSignal;
  origin?: string;
  scope?: FigmaIngestScope;
  onProgress?: (info: IngestProgress) => void;
}

function httpFailureKind(status: number): string {
  if (status === 401) return "Figma authentication failed";
  if (status === 403) return "Figma authorization failed";
  if (status === 404) return "Figma file not found";
  if (status === 429) return "Figma rate limited";
  return `Figma request failed (${status})`;
}

async function figmaError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { err?: string; message?: string };
    return body.err ?? body.message ?? `${res.status} ${res.statusText}`;
  } catch {
    return `${res.status} ${res.statusText}`;
  }
}

function wrapNetworkError(fileKey: string, cause: unknown): Error {
  if (cause instanceof Error && cause.name === "AbortError") {
    return new Error(`Figma file ${fileKey}: request timed out.`);
  }
  return new Error(`Figma file ${fileKey}: network error.`);
}

function unexpectedShape(fileKey: string): Error {
  return new Error(`Figma file ${fileKey}: unexpected response shape.`);
}

async function figmaGet(
  origin: string,
  path: string,
  token: string,
  signal?: AbortSignal,
): Promise<Response> {
  return fetch(`${origin}${path}`, {
    headers: { "X-Figma-Token": token },
    signal,
  });
}

async function getJson(
  origin: string,
  path: string,
  token: string,
  fileKey: string,
  signal?: AbortSignal,
): Promise<unknown> {
  let res: Response;
  try {
    res = await figmaGet(origin, path, token, signal);
  } catch (cause) {
    throw wrapNetworkError(fileKey, cause);
  }
  if (!res.ok) {
    throw new Error(`${httpFailureKind(res.status)} for ${fileKey}: ${await figmaError(res)}`);
  }
  try {
    return await res.json();
  } catch {
    throw new Error(`Figma file ${fileKey}: malformed JSON response.`);
  }
}

async function fetchVariables(
  origin: string,
  fileKey: string,
  token: string,
  signal?: AbortSignal,
): Promise<unknown> {
  try {
    const varRes = await figmaGet(origin, `/v1/files/${fileKey}/variables/local`, token, signal);
    if (varRes.ok) return await varRes.json();
  } catch {
    // Enterprise-gated. 403/404 is expected — the graph still builds.
  }
  return undefined;
}

function adaptFile(fileKey: string, file: unknown, variables: unknown): SourceDocument {
  try {
    return adaptFigmaRestFile({
      fileKey,
      file,
      variables,
      kind: "figma-rest",
    });
  } catch {
    throw unexpectedShape(fileKey);
  }
}

async function fetchFullFile(
  origin: string,
  fileKey: string,
  token: string,
  signal: AbortSignal | undefined,
  variables: unknown,
): Promise<SourceDocument> {
  const file = await getJson(origin, `/v1/files/${fileKey}`, token, fileKey, signal);
  return adaptFile(fileKey, file, variables);
}

async function fetchNodesFile(
  origin: string,
  fileKey: string,
  nodeIds: string[],
  token: string,
  signal: AbortSignal | undefined,
  pages?: ScreenRef[],
): Promise<unknown> {
  const ids = encodeURIComponent(nodeIds.join(","));
  const body = await getJson(origin, `/v1/files/${fileKey}/nodes?ids=${ids}`, token, fileKey, signal);
  try {
    return fileFromNodesResponse(body, pages);
  } catch {
    throw unexpectedShape(fileKey);
  }
}

export async function fetchFigmaRestDocument(
  fileInput: string,
  options: FetchFigmaRestOptions,
): Promise<SourceDocument> {
  const token = options.token.trim();
  if (!token) {
    throw new Error("Figma authentication failed: missing access token.");
  }

  const target = parseFigmaTarget(fileInput);
  const fileKey = target.fileKey;
  const origin = (options.origin ?? figmaApiOrigin()).replace(/\/$/, "");
  const scope = resolveIngestScope(target, options.scope ?? "auto");
  const variablesPromise = fetchVariables(origin, fileKey, token, options.signal);

  if (scope === "file") {
    options.onProgress?.({ phase: "file", done: 0, total: 1, name: fileKey });
    const variables = await variablesPromise;
    return fetchFullFile(origin, fileKey, token, options.signal, variables);
  }

  if (scope === "node") {
    options.onProgress?.({
      phase: "screen",
      done: 0,
      total: 1,
      name: target.nodeIds.join(", "),
    });
    const [file, variables] = await Promise.all([
      fetchNodesFile(origin, fileKey, target.nodeIds, token, options.signal),
      variablesPromise,
    ]);
    options.onProgress?.({
      phase: "screen",
      done: 1,
      total: 1,
      name: target.nodeIds.join(", "),
    });
    return adaptFile(fileKey, file, variables);
  }

  options.onProgress?.({ phase: "outline", done: 0, total: 1, name: fileKey });
  const outline = asRecord(
    await getJson(origin, `/v1/files/${fileKey}?depth=2`, token, fileKey, options.signal),
  );
  const screens = collectTopLevelScreens(outline["document"]);
  if (!screens.length) {
    const variables = await variablesPromise;
    return fetchFullFile(origin, fileKey, token, options.signal, variables);
  }

  const components: Record<string, unknown> = {};
  const componentSets: Record<string, unknown> = {};
  const styles: Record<string, unknown> = {};
  const pages = new Map<string, { id: string; name: string; type: "CANVAS"; children: unknown[] }>();

  for (let i = 0; i < screens.length; i += 1) {
    const screen = screens[i]!;
    options.onProgress?.({
      phase: "screen",
      done: i,
      total: screens.length,
      name: screen.name,
    });
    const wrapped = asRecord(
      await fetchNodesFile(origin, fileKey, [screen.id], token, options.signal, [screen]),
    );
    Object.assign(components, asRecord(wrapped["components"]));
    Object.assign(componentSets, asRecord(wrapped["componentSets"]));
    Object.assign(styles, asRecord(wrapped["styles"]));
    const document = asRecord(wrapped["document"]);
    for (const page of asArray(document["children"])) {
      const rec = asRecord(page);
      const pageId = asString(rec["id"]);
      if (!pageId) continue;
      let bucket = pages.get(pageId);
      if (!bucket) {
        bucket = {
          id: pageId,
          name: asString(rec["name"]) ?? pageId,
          type: "CANVAS",
          children: [],
        };
        pages.set(pageId, bucket);
      }
      bucket.children.push(...asArray(rec["children"]));
    }
  }

  options.onProgress?.({
    phase: "screen",
    done: screens.length,
    total: screens.length,
    name: screens[screens.length - 1]?.name ?? fileKey,
  });

  const variables = await variablesPromise;
  return adaptFile(
    fileKey,
    {
      name: asString(outline["name"]) ?? "Figma file",
      lastModified: outline["lastModified"],
      version: outline["version"],
      thumbnailUrl: outline["thumbnailUrl"],
      document: {
        id: "0:0",
        name: "Document",
        type: "DOCUMENT",
        children: [...pages.values()],
      },
      components,
      componentSets,
      styles,
    },
    variables,
  );
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}
function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}
function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export class FigmaRestIngestionSource implements IngestionSource {
  readonly kind = "figma-rest" as const;
  readonly id: string;
  readonly label: string;
  readonly fileKey: string;
  private readonly fileInput: string;

  constructor(
    fileInput: string,
    private readonly token: string,
    private readonly origin?: string,
    private readonly scope?: FigmaIngestScope,
  ) {
    this.fileInput = fileInput;
    const target = parseFigmaTarget(fileInput);
    this.fileKey = target.fileKey;
    this.id = target.nodeIds.length
      ? `figma-rest:${target.fileKey}:${target.nodeIds.join(",")}`
      : `figma-rest:${target.fileKey}`;
    this.label = target.nodeIds.length
      ? `Figma REST — ${target.fileKey} @ ${target.nodeIds.join(", ")}`
      : `Figma REST — ${target.fileKey}`;
  }

  load(signal?: AbortSignal): Promise<SourceDocument> {
    return fetchFigmaRestDocument(this.fileInput, {
      token: this.token,
      signal,
      origin: this.origin,
      scope: this.scope,
    });
  }
}
