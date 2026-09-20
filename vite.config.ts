/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: {
    proxy: {
      "/api/figma": {
        target: "https://api.figma.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/figma/, ""),
      },
    },
  },
  preview: {
    proxy: {
      "/api/figma": {
        target: "https://api.figma.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/figma/, ""),
      },
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
