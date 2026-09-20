/** http(s) only. Blocks javascript:/data:/file: in imported graph URLs. */
export function safeHref(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return undefined;
    return url;
  } catch {
    return undefined;
  }
}
