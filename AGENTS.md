# Agent notes

Entry point for automated assistants and contributors working in this repository.

## Documentation index


| Document                             | Description                                                                                                           |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| [Architecture](docs/ARCHITECTURE.md) | Monorepo layout, pnpm workspaces, TypeScript and Tailwind v4 strategy, Storybook, and how to add a component package. |


Add new long-form docs under `[docs/](docs/)` and link them here.

## Quick facts

- **Package manager:** pnpm (see root `package.json` `packageManager` and `[pnpm-workspace.yaml](pnpm-workspace.yaml)`).
- **Scope:** `@design-system/`* packages live under `packages/`; apps under `apps/`.
- **Commands (from repo root):** `pnpm run storybook`, `pnpm run build-storybook`, `pnpm run typecheck`, `pnpm run test-storybook` (Vitest + `@storybook/addon-vitest`). For browser tests, install Chromium once: `pnpm run playwright:install` (uses the local `playwright` package — do not run bare `playwright` on the PATH).