import { describe, expect, it } from 'vitest'
import { createInitialGameState } from './gameState'
import { hireWorker, WORKER_CANDIDATES } from './workers'

describe('hireWorker', () => {
  it('fills the first open worker slot', () => {
    const result = hireWorker(createInitialGameState(0), WORKER_CANDIDATES[0].id)

    expect(result.workerSlots).toEqual([WORKER_CANDIDATES[0], null, null])
  })

  it('does not hire the same worker twice', () => {
    const state = hireWorker(createInitialGameState(0), WORKER_CANDIDATES[0].id)

    expect(() => hireWorker(state, WORKER_CANDIDATES[0].id)).toThrow(/already works here/)
  })

  it('stops hiring when all three slots are full', () => {
    const state = WORKER_CANDIDATES.reduce(
      (current, worker) => hireWorker(current, worker.id),
      createInitialGameState(0),
    )

    expect(() => hireWorker(state, 'anyone')).toThrow(/slots are full/)
    expect(state.workerSlots.every(Boolean)).toBe(true)
  })
})
