# ADR 0001: Local game server boundary

- Status: Accepted
- Date: 2026-09-10

## Context

The first version stores progress in the browser, but a later version may use a remote API. Idle progress and timed missions require one place to own time advancement and validate state transitions.

## Decision

Create a game-server module that is authoritative within the running client. Vue components and Pinia never write domain state directly. They request snapshots and, as features are added, send commands through a `GameService` contract.

Persistence is behind an asynchronous `GameRepository`. The initial adapter uses local storage. Simulation remains pure TypeScript and receives authoritative time from the server layer.

## Consequences

- Active and offline play follow the same rules.
- UI code stays independent of persistence details.
- Domain logic is portable and testable without a browser.
- A future HTTP client can implement `GameService` without changing component responsibilities.
- Local authority cannot offer cheat resistance or trustworthy time.
- Moving to a backend will still require authentication, concurrency control, and operational infrastructure.
