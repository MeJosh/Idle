import { describe, expect, it } from 'vitest'
import { createInitialGameState } from './gameState'
import { simulateTo } from './simulation'
import { fireWorker, hireWorker } from './workers'

const alwaysFirst = () => 0

function stateWithCandidates(count = 1) {
  return simulateTo(createInitialGameState(0), count * 60_000, alwaysFirst)
}

describe('hireWorker', () => {
  it('fills the first open worker slot and removes the candidate from the board', () => {
    const state = stateWithCandidates()
    const candidate = state.hiringBoard[0]!
    const result = hireWorker(state, candidate.id)

    expect(result.workerSlots).toEqual([candidate, null, null])
    expect(result.hiringBoard).toEqual([null, null, null])
  })

  it('replaces the selected worker when all slots are full', () => {
    let state = stateWithCandidates(3)
    for (const candidate of [...state.hiringBoard]) state = hireWorker(state, candidate!.id)
    state = simulateTo(state, 240_000, alwaysFirst)
    const replacement = state.hiringBoard[0]!

    const result = hireWorker(state, replacement.id, 1)

    expect(result.workerSlots[1]).toEqual(replacement)
  })

  it('requires a replacement choice when all slots are full', () => {
    let state = stateWithCandidates(3)
    for (const candidate of [...state.hiringBoard]) state = hireWorker(state, candidate!.id)
    state = simulateTo(state, 240_000, alwaysFirst)

    expect(() => hireWorker(state, state.hiringBoard[0]!.id)).toThrow(/Choose a worker to replace/)
  })

  it('rejects a worker who is not on the hiring board', () => {
    expect(() => hireWorker(createInitialGameState(0), 'unknown')).toThrow(/not available/)
  })
})

describe('fireWorker', () => {
  it('clears the slot occupied by the worker', () => {
    const state = stateWithCandidates()
    const candidate = state.hiringBoard[0]!
    const hired = hireWorker(state, candidate.id)

    expect(fireWorker(hired, candidate.id).workerSlots).toEqual([null, null, null])
  })

  it('rejects a worker who is not part of the crew', () => {
    expect(() => fireWorker(createInitialGameState(0), 'unknown')).toThrow(/not part of your crew/)
  })
})
