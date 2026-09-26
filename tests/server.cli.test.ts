import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runCli } from "@/server/cli";
import { clearCache } from "@/server/store";

describe("resolve ingest --role", () => {
  const previousHome = process.env["GRAPHIFY_HOME"];

  beforeEach(() => {
    process.env["GRAPHIFY_HOME"] = mkdtempSync(join(tmpdir(), "resolve-cli-role-"));
    clearCache();
  });

  afterEach(() => {
    clearCache();
    if (previousHome === undefined) delete process.env["GRAPHIFY_HOME"];
    else process.env["GRAPHIFY_HOME"] = previousHome;
  });

  it("fails on junk before ingesting, with a clear error", async () => {
    await expect(runCli(["ingest", "--role", "junk"])).rejects.toThrow(
      /Unknown --role "junk"\. Valid roles: library, product, client\./,
    );
    await expect(runCli(["ingest", "anything.json", "--role", "mystery"])).rejects.toThrow(
      /Unknown --role "mystery"/,
    );
    await expect(runCli(["ingest", "--role"])).rejects.toThrow(/Unknown --role/);
  });
});
