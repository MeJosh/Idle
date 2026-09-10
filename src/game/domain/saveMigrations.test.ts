import { describe, expect, it } from 'vitest'
import { createInitialGameState } from './gameState'
import { CURRENT_SAVE_VERSION, migrateSave, SaveMigrationError } from './saveMigrations'

describe('migrateSave', () => {
  it('loads a save written by the current app version without migration', () => {
    const state = createInitialGameState(1_000)

    expect(migrateSave({ version: CURRENT_SAVE_VERSION, state })).toEqual({
      save: { version: CURRENT_SAVE_VERSION, state },
      migratedFrom: null,
    })
  })

  it('transforms the original numeric save format without losing progress', () => {
    const legacyState = {
      points: 42,
      pointsPerSecond: 1,
      lastSimulatedAt: 1_000,
    }

    expect(migrateSave({ version: 1, state: legacyState })).toEqual({
      save: {
        version: CURRENT_SAVE_VERSION,
        state: { ...legacyState, missions: [] },
      },
      migratedFrom: '0.0.0',
    })
  })

  it('restamps an older compatible semantic version', () => {
    const state = createInitialGameState(1_000)

    expect(migrateSave({ version: '0.0.5', state }).save).toEqual({
      version: CURRENT_SAVE_VERSION,
      state,
    })
  })

  it('refuses to overwrite a save from a newer app version', () => {
    const loadNewerSave = () =>
      migrateSave({ version: '99.0.0', state: createInitialGameState(1_000) })

    expect(loadNewerSave).toThrowError(SaveMigrationError)
    expect(loadNewerSave).toThrow(/newer app version/)
  })

  it('preserves invalid data by failing instead of resetting it', () => {
    expect(() => migrateSave({ version: '0.0.1', state: { points: 42 } })).toThrow(
      /original save was preserved/,
    )
  })
})
