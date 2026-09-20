import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const xssFixture = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures/xss.json");

async function ready(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Figma Graphify" })).toBeVisible();
  await expect(page.getByText(/source: (figma-mcp|mock)/)).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("searchbox", { name: "Search the graph" })).toBeVisible();
}

test("mock graph loads without credentials", async ({ page }) => {
  const dialogs: string[] = [];
  page.on("dialog", (dialog) => {
    dialogs.push(dialog.message());
    void dialog.dismiss();
  });
  await ready(page);
  await page.getByLabel("Data source").selectOption("mock:demo-pay");
  await expect(page.getByRole("heading", { name: "Demo Pay — Product" })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByText("source: mock")).toBeVisible();
  expect(dialogs).toEqual([]);
});

test("Atlas and Explorer clicks update inspector", async ({ page }) => {
  await ready(page);
  await page.getByLabel("Data source").selectOption("mock:demo-pay");
  await expect(page.getByRole("heading", { name: "Demo Pay — Product" })).toBeVisible();

  await expect(page.locator(".atlas__canvas")).toBeVisible();
  await expect(page.locator(".atlas__progress")).toBeHidden({ timeout: 30_000 });
  await page.locator(".atlas__canvas").click({ position: { x: 200, y: 200 } });

  await page.getByRole("tab", { name: "Explorer" }).click();
  await expect(page.locator(".react-flow")).toBeVisible();

  await page.getByRole("searchbox", { name: "Search the graph" }).fill("Banner");
  await page.getByRole("button", { name: /Banner/ }).first().click();
  await expect(page.locator(".inspector h2")).toHaveText("Banner");

  await page.locator(".breadcrumbs__link:not(.is-current)").first().click();
  await expect(page.locator(".inspector h2")).not.toHaveText("Banner");

  await page.getByTitle("Back").click();
  await expect(page.locator(".inspector h2")).toHaveText("Banner");

  const node = page.locator(".design-node").first();
  await node.click();
  await node.click({ modifiers: ["ControlOrMeta"] });
});

test("XSS payloads render as text, not HTML", async ({ page }) => {
  const dialogs: string[] = [];
  page.on("dialog", (dialog) => {
    dialogs.push(dialog.message());
    void dialog.dismiss();
  });
  await ready(page);
  await page.locator('input[type="file"]').setInputFiles(xssFixture);
  await expect(page.getByRole("heading", { name: "<img src=x onerror=alert(1)>" })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.locator("script", { hasText: "alert(1)" })).toHaveCount(0);
  await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);
  await page.getByRole("tab", { name: "Explorer" }).click();
  await page.getByRole("searchbox", { name: "Search the graph" }).fill("XSS Frame");
  await page.getByRole("button", { name: /XSS Frame/ }).first().click();
  await expect(page.locator(".inspector h2")).toContainText("XSS Frame");
  await expect(page.locator(".inspector a[href^='javascript:']")).toHaveCount(0);
  expect(dialogs).toEqual([]);
});

test("keyboard can switch views and search", async ({ page }) => {
  await ready(page);
  await page.getByRole("tab", { name: "Explorer" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("tab", { name: "Explorer" })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("searchbox", { name: "Search the graph" }).fill("Banner");
  await expect(page.getByRole("region", { name: "Node browser" })).toContainText("Banner");
});

test("axe has no critical or serious violations", async ({ page }) => {
  await ready(page);
  const atlas = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
  const atlasBad = atlas.violations.filter(
    (item) => item.impact === "critical" || item.impact === "serious",
  );
  expect(atlasBad, JSON.stringify(atlasBad.map((item) => item.id))).toEqual([]);

  await page.getByRole("tab", { name: "Explorer" }).click();
  await expect(page.locator(".react-flow")).toBeVisible();
  const explorer = await new AxeBuilder({ page })
    .exclude(".react-flow")
    .disableRules(["color-contrast"])
    .analyze();
  const explorerBad = explorer.violations.filter(
    (item) => item.impact === "critical" || item.impact === "serious",
  );
  expect(explorerBad, JSON.stringify(explorerBad.map((item) => item.id))).toEqual([]);
});
