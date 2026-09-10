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
})

describe('isMissionComplete', () => {
  it('uses an absolute completion timestamp', () => {
    const mission = { id: 'one', kind: 'survey', startedAt: 0, completesAt: 1_800_000 }

    expect(isMissionComplete(mission, 1_799_999)).toBe(false)
    expect(isMissionComplete(mission, 1_800_000)).toBe(true)
  })
})
