import type { GameState } from './gameState'
import { WORKER_CANDIDATE_INTERVAL_MS } from './workerGenerator'

export function hireWorker(state: GameState, workerId: string, targetSlot?: number): GameState {
  const openSlot = state.workerSlots.findIndex((slot) => slot === null)
  const destination = targetSlot ?? openSlot
  if (!Number.isInteger(destination) || destination < 0 || destination >= state.workerSlots.length) {
    throw new Error(openSlot === -1 ? 'Choose a worker to replace.' : 'That worker slot does not exist.')
  }

  const candidateSlot = state.hiringBoard.findIndex((candidate) => candidate?.id === workerId)
  const worker = state.hiringBoard[candidateSlot]
  if (!worker) throw new Error('That worker is not available.')

  if (state.workerSlots.some((slot) => slot?.id === workerId)) {
    throw new Error(`${worker.name} already works here.`)
  }

  const workerSlots = [...state.workerSlots]
  workerSlots[destination] = { ...worker }
  const hiringBoard = [...state.hiringBoard]
  hiringBoard[candidateSlot] = null

  return {
    ...state,
    workerSlots,
    hiringBoard,
    nextWorkerCandidateAt:
      state.nextWorkerCandidateAt ?? state.lastSimulatedAt + WORKER_CANDIDATE_INTERVAL_MS,
  }
}

export function fireWorker(state: GameState, workerId: string): GameState {
  const occupiedSlot = state.workerSlots.findIndex((worker) => worker?.id === workerId)
  if (occupiedSlot === -1) throw new Error('That worker is not part of your crew.')

  const workerSlots = [...state.workerSlots]
  workerSlots[occupiedSlot] = null
  return { ...state, workerSlots }
}
