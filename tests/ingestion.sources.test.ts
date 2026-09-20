import { describe, expect, it } from "vitest";
import {
  JsonIngestionSource,
  MockIngestionSource,
  SourceDocumentSchema,
} from "@/core/ingestion";
import { buildGraph } from "@/core/transform";
import { graph as acmeGraph, sourceDocument } from "./fixture";

const pluginDocument = {
  fileKey: "plugin-key",
  fileName: "From plugin",
  root: {
    id: "0:0",
    name: "Document",
    type: "DOCUMENT",
    children: [
      {
        id: "1:0",
        name: "Page",
        type: "CANVAS",
        children: [
          {
            id: "1:1",
            name: "Screen",
            type: "FRAME",
            children: [
              { id: "1:2", name: "Button", type: "INSTANCE", componentId: "2:1" },
            ],
          },
        ],
      },
    ],
  },
  components: { "2:1": { id: "2:1", name: "Button" } },
  source: { kind: "figma-plugin" as const, ingestedAt: "2026-01-01T00:00:00.000Z" },
};

describe("MockIngestionSource", () => {
  it("loads Acme Pay without credentials", async () => {
    const doc = await new MockIngestionSource().load();
    expect(doc.source.kind).toBe("mock");
    expect(doc.fileName).toBe("Acme Pay — Product");
    expect(doc.root.children?.length).toBeGreaterThan(0);
  });
});

describe("JsonIngestionSource", () => {
  it("passes through an already-normalised SourceDocument", async () => {
    const doc = await new JsonIngestionSource("id", "label", pluginDocument).load();
    expect(doc.source.kind).toBe("figma-plugin");
    expect(doc.fileKey).toBe("plugin-key");
    const graph = buildGraph(doc, { builtAt: "2026-01-01T00:00:00.000Z" });
    const instanceOf = graph.edges.find((edge) => edge.type === "INSTANCE_OF");
    expect(instanceOf?.confidence).toBeUndefined();
  });

  it("falls back to the REST file adapter", async () => {
    const doc = await new JsonIngestionSource("id", "rest.json", {
      name: "Dropped file",
      document: {
        id: "0:0",
        name: "Document",
        type: "DOCUMENT",
        children: [{ id: "1:0", name: "Page 1", type: "CANVAS", children: [] }],
      },
    }).load();
    expect(doc.source.kind).toBe("json");
    expect(doc.fileName).toBe("Dropped file");
  });

  it("rejects arrays, empty objects, and unrecognised shapes", async () => {
    await expect(new JsonIngestionSource("id", "bad", []).load()).rejects.toThrow();
    await expect(new JsonIngestionSource("id", "bad", {}).load()).rejects.toThrow();
    await expect(new JsonIngestionSource("id", "bad", { foo: 1 }).load()).rejects.toThrow();
  });

  it("accepts an MCP get_metadata capture", async () => {
    const doc = await new JsonIngestionSource("id", "mcp.json", {
      fileKey: "KEY",
      fileName: "File",
      captures: [
        {
          nodeId: "1:1",
          metadataXml: `<frame id="1:1" name="Screen"><instance id="1:2" name="Card"><slot id="1:3" name="Slot"><instance id="1:4" name="Button" /></slot></instance></frame>`,
        },
      ],
    }).load();
    expect(doc.source.kind).toBe("figma-mcp");
    expect(doc.root.children?.[0]?.children?.[0]?.children?.[0]?.children?.[0]?.name).toBe("Button");
  });

  it("does not apply prototype-pollution keys", async () => {
    const payload = JSON.parse(
      JSON.stringify({
        ...pluginDocument,
        components: { "2:1": { id: "2:1", name: "Button" } },
      }).replace(/}$/, ',"__proto__":{"polluted":true}}'),
    ) as unknown;
    const parsed = SourceDocumentSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
    expect(Object.prototype).not.toHaveProperty("polluted");
  });
});

describe("re-ingestion", () => {
  it("produces identical node and edge ids for the same source", () => {
    const again = buildGraph(sourceDocument, { builtAt: "2026-01-01T00:00:00.000Z" });
    expect(again.nodes.map((node) => node.id)).toEqual(acmeGraph.nodes.map((node) => node.id));
    expect(again.edges.map((edge) => `${edge.type}:${edge.source}->${edge.target}`)).toEqual(
      acmeGraph.edges.map((edge) => `${edge.type}:${edge.source}->${edge.target}`),
    );
  });
});
