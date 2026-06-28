import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // Only run tests inside the app/ directory - the course-video-manager
    // is a separate project with its own uninstalled dependencies.
    include: ["app/**/*.test.ts"],
  },
})
