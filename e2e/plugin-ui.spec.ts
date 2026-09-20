import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ui = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "../figma-plugin/ui.html"),
  "utf8",
);

test("plugin UI posts export/close and treats error HTML as text", async ({ page }) => {
  const dialogs: string[] = [];
  page.on("dialog", (dialog) => {
    dialogs.push(dialog.message());
    void dialog.dismiss();
  });

  await page.setContent(ui);

  const exportMessage = await page.evaluate(() => {
    return new Promise<unknown>((resolve) => {
      window.addEventListener(
        "message",
        (event) => {
          resolve(event.data);
        },
        { once: true },
      );
      (document.getElementById("run") as HTMLButtonElement).click();
    });
  });
  expect(exportMessage).toEqual({ pluginMessage: { type: "export", scope: "page" } });

  const closeMessage = await page.evaluate(() => {
    return new Promise<unknown>((resolve) => {
      window.addEventListener(
        "message",
        (event) => {
          resolve(event.data);
        },
        { once: true },
      );
      (document.getElementById("close") as HTMLButtonElement).click();
    });
  });
  expect(closeMessage).toEqual({ pluginMessage: { type: "close" } });

  await page.evaluate(() => {
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          pluginMessage: { type: "error", message: '<img src=x onerror=alert(1)>' },
        },
      }),
    );
  });
  await expect(page.locator("#status")).toHaveText('<img src=x onerror=alert(1)>');
  await expect(page.locator("#status img")).toHaveCount(0);

  await page.evaluate(() => {
    window.dispatchEvent(
      new MessageEvent("message", {
        data: { pluginMessage: { type: "progress", visited: 12 } },
      }),
    );
  });
  await expect(page.locator("#status")).toHaveText("Walking the document… 12 nodes");
  expect(dialogs).toEqual([]);
});
