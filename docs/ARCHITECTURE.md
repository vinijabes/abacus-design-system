# Design system monorepo — architecture

This document describes how the repository is structured and how the pieces fit together. It is intended for future contributors and coding agents.

## Stack

| Area | Choice |
|------|--------|
| Package manager | **pnpm** (workspaces). Root [`package.json`](../package.json) sets `packageManager` for Corepack. |
| Runtime | **Node** ≥ 20 |
| Language | **TypeScript** (strict, bundler resolution) |
| UI | **React** 18/19 (components declare `react` / `react-dom` as peers) |
| Styling | **Tailwind CSS** v4.x (CSS-first config; utilities built where the app imports CSS) |
| Docs / dev shell | **Storybook** 10.x with **Vite** and `@storybook/react-vite` |

## Workspace layout

Defined in [`pnpm-workspace.yaml`](../pnpm-workspace.yaml):

- `packages/*` — shared config and **one npm package per component** (e.g. `@design-system/button`).
- `apps/*` — applications; currently only **Storybook** (`@design-system/storybook`).

All scoped packages use the **`@design-system/*`** namespace.

### Package index

| Package | Path | Role |
|---------|------|------|
| `@design-system/tsconfig` | [`packages/tsconfig`](../packages/tsconfig) | Shared TS configs: `base.json`, `react-library.json`. Consumed via `"extends": "@design-system/tsconfig/react-library.json"`. |
| `@design-system/tailwind-config` | [`packages/tailwind-config`](../packages/tailwind-config) | Shared design tokens / `@theme` in [`theme.css`](../packages/tailwind-config/theme.css). Imported by apps (Storybook), not compiled inside each component package. |
| `@design-system/button` | [`packages/button`](../packages/button) | Example component: source-only exports (`main`/`types`/`exports` point at `src`). |
| `@design-system/storybook` | [`apps/storybook`](../apps/storybook) | Storybook app: Vite builder, global CSS entry, discovers stories across the repo. |

## Internal dependencies (`workspace:*`)

Cross-package dependencies use the **`workspace:*`** protocol in `package.json` (pnpm resolves them to local workspace packages). Examples:

- [`apps/storybook/package.json`](../apps/storybook/package.json) depends on `@design-system/button`, `@design-system/tailwind-config`, `@design-system/tsconfig`.
- [`packages/button/package.json`](../packages/button/package.json) depends on `@design-system/tsconfig`.

Do not use `npm`’s `workspaces` field in the root `package.json`; the workspace root is [`pnpm-workspace.yaml`](../pnpm-workspace.yaml).

## TypeScript

- **Base** shared options: [`packages/tsconfig/base.json`](../packages/tsconfig/base.json) (`moduleResolution: bundler`, strict, `noEmit` at base level).
- **React libraries** extend [`packages/tsconfig/react-library.json`](../packages/tsconfig/react-library.json) (`jsx: react-jsx`).
- Each package that compiles TS has its own `tsconfig.json` extending the shared preset.
- **Component packages** ship **TypeScript source** (`exports` → `src/*.ts(x)`); there is no separate `dist` build in the current setup.
- **Stories** in component packages are excluded from that package’s `tsc` run (see `exclude` in [`packages/button/tsconfig.json`](../packages/button/tsconfig.json)) so `tsc` does not need Storybook types there. Storybook still type-checks its own config and [`apps/storybook/src`](../apps/storybook/src) via its `typecheck` script.

## Tailwind CSS v4

- **No legacy `tailwind.config.js`** at the repo root for the baseline: theme and tokens live in CSS using `@theme` inside [`packages/tailwind-config/theme.css`](../packages/tailwind-config/theme.css).
- **Tailwind is built in the Storybook app** (Vite + `@tailwindcss/vite` in [`apps/storybook/.storybook/main.ts`](../apps/storybook/.storybook/main.ts)). Component packages do not run PostCSS/Tailwind themselves.
- **Global CSS entry**: [`apps/storybook/src/styles.css`](../apps/storybook/src/styles.css):
  - `@import "tailwindcss";`
  - `@import "@design-system/tailwind-config/theme.css";`
  - `@source` globs tell Tailwind which files to scan for class names (all component sources under `packages/*/src`).
- **Vite filesystem access**: `viteFinal` sets `server.fs.allow` to the **monorepo root** so Storybook can read stories and sources outside `apps/storybook`.

## Storybook

- **Framework**: `@storybook/react-vite` (Storybook 10.x).
- **Addons**: `@storybook/addon-docs` (listed in [`main.ts`](../apps/storybook/.storybook/main.ts)).
- **Stories location**: **Colocated** with components, e.g. `packages/button/src/Button.stories.tsx`. The glob is absolute from the repo root: `packages/*/src/**/*.stories.@(ts|tsx)` (see [`main.ts`](../apps/storybook/.storybook/main.ts)).
- **Preview**: [`preview.ts`](../apps/storybook/.storybook/preview.ts) imports the global stylesheet once.

## Root scripts

Run from the repository root:

| Script | What it does |
|--------|----------------|
| `pnpm run storybook` | Dev server for `@design-system/storybook` (port 6006). |
| `pnpm run build-storybook` | Static build → `apps/storybook/storybook-static`. |
| `pnpm run typecheck` | `pnpm -r run --if-present typecheck` across workspaces that define the script. |

## Adding a new component package

1. Create `packages/<name>/` with `package.json` named `@design-system/<name>`, `type: "module"`, and `peerDependencies` on `react` / `react-dom` as needed.
2. Point `exports` / `main` / `types` at `src` entrypoints (same pattern as [`packages/button`](../packages/button)).
3. Add `"extends": "@design-system/tsconfig/react-library.json"` in `tsconfig.json`; add `@design-system/tsconfig` as `devDependency` with `workspace:*`.
4. Add **`@source`** coverage if new paths are not matched by existing globs in [`apps/storybook/src/styles.css`](../apps/storybook/src/styles.css) (extend the glob if components live outside `packages/*/src`).
5. Colocate `*.stories.tsx` under the package `src/` tree; Storybook picks them up via the existing `main.ts` glob.
6. Wire the package into Storybook if it must be imported by name: add `workspace:*` dependency in [`apps/storybook/package.json`](../apps/storybook/package.json) when the story imports `@design-system/<name>`.

## Files agents often touch

| Task | Likely files |
|------|----------------|
| New token / theme | [`packages/tailwind-config/theme.css`](../packages/tailwind-config/theme.css) |
| Stricter TS / new TS preset | [`packages/tsconfig/*.json`](../packages/tsconfig) |
| Storybook / Vite / Tailwind pipeline | [`apps/storybook/.storybook/main.ts`](../apps/storybook/.storybook/main.ts), [`apps/storybook/src/styles.css`](../apps/storybook/src/styles.css) |
| Workspace membership | [`pnpm-workspace.yaml`](../pnpm-workspace.yaml) |

## Conventions

- **One package per component** under `packages/` keeps versioning and boundaries clear for consumers.
- **Shared config only** in `@design-system/tsconfig` and `@design-system/tailwind-config`; avoid duplicating the same `tsconfig` or theme fragments inside each component.
- Prefer **colocated stories** so each package owns its examples and docs entries.
