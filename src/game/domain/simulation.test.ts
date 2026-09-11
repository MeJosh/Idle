import { describe, expect, it } from 'vitest'
import { createInitialGameState } from './gameState'
import { isMissionComplete, simulateTo } from './simulation'

describe('simulateTo', () => {
  it('advances the authoritative timestamp', () => {
    const result = simulateTo(createInitialGameState(10_000), 70_000)

    expect(result.lastSimulatedAt).toBe(70_000)
  })

  it('does not award the same elapsed time twice', () => {
    const once = simulateTo(createInitialGameState(0), 30_000)

    expect(simulateTo(once, 30_000)).toEqual(once)
  })

  it('does not run backward when the clock moves backward', () => {
    const state = createInitialGameState(10_000)

    expect(simulateTo(state, 5_000)).toEqual(state)
  })

  it('adds a generated candidate each minute until the hiring board is full', () => {
    const result = simulateTo(createInitialGameState(0), 10 * 60_000, () => 0)

    expect(result.hiringBoard.map((worker) => worker?.name)).toEqual([
      'Ada Ash',
      'Ada Ash',
      'Ada Ash',
    ])
    expect(result.workerCandidateSequence).toBe(3)
    expect(result.nextWorkerCandidateAt).toBeNull()
  })
})

describe('isMissionComplete', () => {
  it('uses an absolute completion timestamp', () => {
    const mission = { id: 'one', kind: 'survey', startedAt: 0, completesAt: 1_800_000 }

    expect(isMissionComplete(mission, 1_799_999)).toBe(false)
    expect(isMissionComplete(mission, 1_800_000)).toBe(true)
  })
})
