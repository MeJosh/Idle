# Save data

## Envelope

Every local save uses a versioned envelope:

```json
{
  "version": "0.1.0",
  "state": {}
}
```

`version` is the application version imported directly from `package.json`. It identifies the app release that most recently wrote the save. The domain state remains inside `state` so envelope metadata can evolve independently.

## Compatibility policy

Application releases follow semantic versioning, but an application version change does not automatically require a new save transform:

- If an older save already passes the current state validator, it is compatible and can be restamped with the current application version.
- If a schema change makes older state invalid, add an ordered migration covering the affected semantic-version range.
- A save from a newer application version is rejected without being overwritten. This prevents an older deployment or cached client from downgrading player data.
- Invalid JSON, unknown version formats, and state that still fails validation after migration are rejected without being overwritten.

During early `0.x` development, treat minor-version changes as potentially breaking. Prefer optional fields and backward-compatible defaults when possible, but never weaken validation merely to make an old save load.

## Migration procedure

When a release changes the stored state shape:

1. Bump `package.json` according to the release's semantic impact.
2. Add a migration to `src/game/domain/saveMigrations.ts` with a precise source-version range and target version.
3. Keep transforms pure: accept unknown state, return transformed state, and do not read storage or time.
4. Add tests using realistic state from the oldest supported source version.
5. Confirm the transformed state passes the current validator.
6. Keep earlier migrations in order so saves can move through multiple releases.

Do not edit a released migration after users may have run it. Append a new corrective migration instead.

## Legacy saves and backups

The original numeric save version (`1`) normalizes to semantic version `0.0.0` and migrates into the `0.1.0` schema. Missing mission data receives an empty mission list while existing points and timestamps are preserved.

Before a migrated save is written, its original serialized value is copied from `idle-game:save` to `idle-game:save:backup`. The backup is replaced only by a later successful migration, not by routine saves.
