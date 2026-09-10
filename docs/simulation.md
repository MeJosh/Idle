# Simulation

## Core rule

Game progress is calculated from elapsed timestamps, not from the number of timer callbacks received.

For now, simulation advances `lastSimulatedAt` to `now`. Repeating a simulation at the same timestamp is therefore idempotent and cannot process the same time twice. There is no passive resource generation; later worker tasks can use this timestamp boundary for offline completion.

## Active and offline play

Active and offline progress use the same `simulateTo(state, now)` function:

- While open, the UI asks for a fresh snapshot about once per second.
- When returning to the tab, it immediately requests a fresh snapshot.
- On startup, the saved state advances directly from its last timestamp to the current timestamp.

The interval controls display freshness only. Background-tab throttling, a sleeping laptop, or a closed browser do not change the calculation.

## Missions

A fixed-duration mission stores absolute timestamps:

```text
startedAt   = authoritativeNow
completesAt = startedAt + duration
```

A mission is ready when `now >= completesAt` and it has not already been claimed. Avoid decrementing and persisting a “seconds remaining” counter; remaining time is a derived display value.

## Determinism

Simulation functions accept `now` as an argument and return new state. They do not call `Date.now()`, access storage, or mutate their input. This makes them straightforward to test and portable to a future backend.

When systems become interdependent, use an ordered simulation pipeline. Each system receives the state produced by the prior step. The order becomes a documented game rule and must be covered by tests.

## Clock and numeric policy

The current local server prevents negative elapsed time if the device clock moves backward. It cannot prevent a player from moving the clock forward; client-side authority is an architectural boundary, not an anti-cheat boundary.

Before future resource values exceed safe numeric ranges, choose and document a large-number representation. Do not mix representations across systems.

## Decisions still to make

- Maximum offline duration, if any.
- Whether production pauses during specific game states.
- Catch-up performance for complex simulations.
- Floating-point rounding rules and large-number support.
- Mission claiming versus automatic reward settlement.
- How to resolve progress from multiple browser tabs.
