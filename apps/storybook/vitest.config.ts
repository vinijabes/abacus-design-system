import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname = path.dirname(fileURLToPath(import.meta.url));
/** Must match Storybook dev URL/port so global-setup skips spawning a second Storybook. */
const storybookConfigDir = path.resolve(dirname, ".storybook");

export default defineConfig(async () => ({
  // Help Vite replace static `import.meta.env.*` in browser tests (avoids module-runner envProxy
  // errors when dependencies touch env without going through the dev transform).
  define: {
    "import.meta.env.BASE_URL": JSON.stringify("/"),
    "import.meta.env.MODE": JSON.stringify("test"),
    "import.meta.env.DEV": JSON.stringify(true),
    "import.meta.env.PROD": JSON.stringify(false),
    "import.meta.env.SSR": JSON.stringify(false),
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-dev-runtime"],
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          await storybookTest({
            configDir: storybookConfigDir,
            storybookScript: "pnpm run storybook -- --no-open",
            storybookUrl: "http://localhost:6006",
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
}));
