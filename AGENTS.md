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
- **Commands (from repo root):** `pnpm run storybook`, `pnpm run build-storybook`, `pnpm run typecheck`.