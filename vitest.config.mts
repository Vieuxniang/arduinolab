import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  // Next's tsconfig uses `jsx: "preserve"`, which would leave JSX untransformed
  // in tests; force oxc's automatic JSX runtime instead.
  oxc: {
    jsx: { runtime: "automatic" },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["tests/setup.ts"],
  },
})
