# Architecture

## Goals

- Work well on mobile and desktop.
- Support deterministic active and offline progress.
- Keep game rules outside Vue components and Pinia stores.
- Persist locally now without coupling the UI to local storage.
- Preserve a practical migration path to a remote authoritative API.

## Layers

```text
Vue components
      |
Pinia read model
      |
GameService contract
      |
Local game server  --->  GameRepository  --->  localStorage
      |
Pure domain simulation
```

`src/game/domain` contains plain TypeScript rules and data structures. It must not depend on Vue, Pinia, browser storage, or wall-clock globals.

`src/game/server` owns authoritative state in the current application. It reads the clock, advances the domain simulation, validates persistence, and returns cloned snapshots. UI code cannot directly mutate its state.

`src/game/client` adapts authoritative snapshots into reactive Pinia state. Pinia is deliberately a read model and command gateway, not the owner of game rules.

## Project layout

```text
src/
  game/
    client/       Pinia stores and the GameService client contract
    domain/       State, calculations, simulation, domain tests
    server/       Local authority and persistence adapters
  App.vue         Minimal responsive application shell
docs/
  decisions/      Architecture decision records
```

## Data flow

1. The UI starts the Pinia game store.
2. The store requests a snapshot through `GameService`.
3. The local game server loads persisted state and simulates it to the current time.
4. The server persists the new authoritative timestamp and returns a cloned snapshot.
5. Pinia publishes that snapshot to the UI.
6. A one-second UI refresh and visibility changes request another synchronization. Correctness never depends on the interval firing exactly on time.

## Future API migration

The intended migration is to implement `GameService` with HTTP calls and host the server/domain modules remotely. Pinia and components continue to consume snapshots and send commands through the same boundary. `GameRepository` can then become a database adapter on the server.

This is a migration seam, not a promise of zero changes. Authentication, conflict handling, server timestamps, request idempotency, and database migrations will be needed when a backend is introduced.

## State evolution

Persisted data uses an explicit save version. Every schema change must either:

- remain backward compatible;
- add a migration from every supported earlier version; or
- intentionally invalidate saves with a documented product decision.

The version written into each save is the semantic version from `package.json`. Compatible older state can be validated and restamped without a schema-specific transform. Incompatible older state must pass through ordered migrations before validation.

Malformed or newer-version data is never silently reset or overwritten. A successful migration retains the original serialized save at `idle-game:save:backup` before writing the transformed state. See [Save data](./save-data.md) for the release and migration procedure.

## UI preferences

Presentation preferences are not part of authoritative game state. On first use, the color theme follows the operating-system preference. The binary Light/Dark toggle stores an explicit choice under the separate `idle-game:theme` local-storage key. Moving game state to an API must not move device-specific display preferences with it.
