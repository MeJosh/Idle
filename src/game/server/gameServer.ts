import { createInitialGameState, type GameState } from '../domain/gameState'
import { simulateTo } from '../domain/simulation'
import type { GameRepository } from './gameRepository'

export interface Clock {
  now(): number
}

export function createGameServer(repository: GameRepository, clock: Clock) {
  let state: GameState | null = null
  let initialization: Promise<GameState> | null = null

  const snapshot = () => structuredClone(state as GameState)

  async function initialize(): Promise<GameState> {
    if (state) return snapshot()
    if (initialization) return structuredClone(await initialization)

    initialization = (async () => {
      const now = clock.now()
      const saved = await repository.load()
      state = simulateTo(saved ?? createInitialGameState(now), now)
      await repository.save(state)
      return snapshot()
    })()

    return structuredClone(await initialization)
  }

  async function sync(): Promise<GameState> {
    await initialize()
    const nextState = simulateTo(state as GameState, clock.now())

    if (nextState !== state) {
      state = nextState
      await repository.save(state)
    }

    return snapshot()
  }

  return { initialize, sync }
}
