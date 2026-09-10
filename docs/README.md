# Technical documentation

This directory records architectural decisions that should outlive individual implementation sessions.

- [Architecture](./architecture.md): boundaries, data flow, and project layout.
- [Technology stack](./technology-stack.md): dependencies and intentionally deferred libraries.
- [Contributing](./contributing.md): package-manager and commit conventions.
- [Simulation](./simulation.md): time advancement, offline progress, and mission timers.
- [Delivery plan](./plan.md): staged framework and game-foundation work.
- [ADR 0001](./decisions/0001-local-game-server.md): why the app has a client-side authoritative game server.

## Documentation conventions

- Update these documents when a domain rule or system boundary changes.
- Record consequential decisions as ADRs; do not rewrite accepted ADR history.
- Keep product design and balancing values separate from technical invariants.
