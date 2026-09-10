import type { GameState } from '../domain/gameState'
import {
  CURRENT_SAVE_VERSION,
  migrateSave,
  SaveMigrationError,
  type SaveData,
} from '../domain/saveMigrations'
import type { GameRepository } from './gameRepository'

const STORAGE_KEY = 'idle-game:save'
const BACKUP_STORAGE_KEY = 'idle-game:save:backup'

export class LocalStorageGameRepository implements GameRepository {
  private pendingBackup: string | null = null

  async load(): Promise<GameState | null> {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (!serialized) return null

    try {
      const result = migrateSave(JSON.parse(serialized))
      if (result.migratedFrom) this.pendingBackup = serialized
      return result.save.state
    } catch (cause) {
      if (cause instanceof SaveMigrationError) throw cause
      throw new SaveMigrationError(
        'invalid-save',
        'The stored save could not be read. The original save was preserved.',
      )
    }
  }

  async save(state: GameState): Promise<void> {
    if (this.pendingBackup) {
      localStorage.setItem(BACKUP_STORAGE_KEY, this.pendingBackup)
      this.pendingBackup = null
    }

    const save: SaveData = { version: CURRENT_SAVE_VERSION, state }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save))
  }
}
