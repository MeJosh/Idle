# ADR 0002: Semantic save versions

- Status: Accepted
- Date: 2026-09-10

## Context

Browser saves will outlive individual releases. Schema changes must preserve player progress, while cached or downgraded clients must not overwrite data written by a newer release.

## Decision

Use the semantic application version from `package.json` as the version in each save envelope. Validate compatible older saves directly and use ordered, range-based transforms only when their shape is no longer compatible. Refuse newer or invalid saves without modifying local storage.

Before replacing a successfully migrated save, retain its original serialized envelope in a backup key.

## Consequences

- The application and save format share one visible release vocabulary.
- Routine version bumps do not require empty migrations.
- Schema-changing releases require explicit migration tests.
- Downgrades fail safely instead of silently discarding fields.
- Backups consume one additional save-sized local-storage entry.
