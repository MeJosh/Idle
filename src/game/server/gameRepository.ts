import type { GameState } from '../domain/gameState'

/** Async by design so a future HTTP implementation can replace local storage. */
export interface GameRepository {
  load(): Promise<GameState | null>
  save(state: GameState): Promise<void>
}
