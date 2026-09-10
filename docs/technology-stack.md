# Technology stack

## Runtime dependencies

| Dependency | Responsibility |
| --- | --- |
| Vue | Component model and rendering |
| Pinia | Reactive client read models and command entry points |
| Tailwind CSS | Responsive, utility-first styling |
| `@tailwindcss/vite` | Tailwind's build integration for Vite |
| Rough.js | Resize-aware, hand-drawn SVG decoration for the game interface |
| semver | Standards-compliant save-version comparison and migration ranges |

## Development dependencies

| Dependency | Responsibility |
| --- | --- |
| Vite | Development server and production bundling |
| TypeScript | Static types for UI, domain, and server boundaries |
| `vue-tsc` | Type-checking Vue single-file components |
| Vitest | Fast tests for deterministic game rules |
| `@vitejs/plugin-vue` | Vue single-file component compilation |
| pnpm | Dependency installation and lockfile management |
| Husky | Git hook installation and execution |
| Commitlint | Conventional Commit validation |

Exact installed versions and version ranges live in `package.json` and `pnpm-lock.yaml`.

## Intentionally deferred

- Vue Router: add when the product has distinct navigable screens.
- Component libraries: add only after interaction and visual patterns are established.
- Runtime schema library: reconsider when save migrations or network payloads become complex.
- Arbitrary-precision numbers: select after the game's growth curve is known.
- API/query client: select when a remote service exists.

Keeping these out of the initial scaffold reduces architectural commitment before the game loop is defined.
