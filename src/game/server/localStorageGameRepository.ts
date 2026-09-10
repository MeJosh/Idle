import { isSaveData, SAVE_VERSION, type GameState, type SaveData } from '../domain/gameState'
import type { GameRepository } from './gameRepository'

const STORAGE_KEY = 'idle-game:save'

export class LocalStorageGameRepository implements GameRepository {
  async load(): Promise<GameState | null> {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (!serialized) return null

    try {
      const save: unknown = JSON.parse(serialized)
      return isSaveData(save) ? structuredClone(save.state) : null
    } catch {
      return null
    }
  }

  async save(state: GameState): Promise<void> {
    const save: SaveData = { version: SAVE_VERSION, state }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save))
  }
}
