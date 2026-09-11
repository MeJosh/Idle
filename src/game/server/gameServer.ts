import { createInitialGameState, type GameState } from '../domain/gameState'
import { simulateTo } from '../domain/simulation'
import { fireWorker as fireWorkerInState, hireWorker as hireWorkerInState } from '../domain/workers'
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

  async function hireWorker(workerId: string, targetSlot?: number): Promise<GameState> {
    await initialize()
    state = hireWorkerInState(simulateTo(state as GameState, clock.now()), workerId, targetSlot)
    await repository.save(state)
    return snapshot()
  }

  async function fireWorker(workerId: string): Promise<GameState> {
    await initialize()
    state = fireWorkerInState(simulateTo(state as GameState, clock.now()), workerId)
    await repository.save(state)
    return snapshot()
  }

  return { initialize, sync, hireWorker, fireWorker }
}
