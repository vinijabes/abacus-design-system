import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(__dirname, "../../..");

const config: StorybookConfig = {
  stories: [
    path.join(monorepoRoot, "packages/*/src/**/*.stories.@(ts|tsx)"),
  ],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(cfg) {
    const { mergeConfig } = await import("vite");
    return mergeConfig(cfg, {
      plugins: [tailwindcss()],
      server: {
        fs: {
          allow: [monorepoRoot],
        },
      },
    });
  },
};

export default config;
