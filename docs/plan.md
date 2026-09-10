# Delivery plan

## Phase 1: foundation (implemented)

- Vite, Vue 3, and TypeScript application scaffold.
- Tailwind CSS through its Vite integration.
- Pinia application state.
- Vitest for deterministic domain tests.
- Responsive proof-of-concept surface.
- Versioned local-storage repository.
- Client-side authoritative game server.
- Timestamp-based active and offline point generation.
- Absolute-time mission completion primitive.

## Phase 2: harden the game platform

- Define explicit command types such as `startMission` and `claimMission`.
- Serialize server commands to prevent overlapping writes.
- Add an explicit player-facing recovery/export flow for preserved invalid saves.
- Add a multi-tab ownership or synchronization policy.
- Add injectable in-memory repositories and server-level integration tests.
- Decide offline caps, numeric precision, and clock policy.

## Phase 3: first real game loop

- Define resources, generators, costs, and unlock conditions in the domain layer.
- Add the smallest playable command loop without embedding balance rules in components.
- Establish accessible mobile-first interaction patterns.
- Add domain tests for purchases, unlocks, and long offline windows.

## Phase 4: remote authority, when needed

- Add an HTTP implementation of `GameService`.
- Move the game server and simulation package to a trusted runtime.
- Replace local storage with a server repository.
- Add identity, server time, idempotent commands, and conflict handling.
- Keep local storage only as an optional cache, never as remote authority.

## Near-term design questions

The following choices materially affect the next implementation slice:

1. Is the core loop primarily purchasing generators, assigning missions, or both?
2. Should offline earnings be unlimited or capped?
3. Are fractional resources meaningful, or should every domain calculation settle to integers?
4. Should mission rewards be claimed manually or applied automatically at completion?
