import type { GameState, Mission } from './gameState'
import { generateWorker, WORKER_CANDIDATE_INTERVAL_MS } from './workerGenerator'

/** Advances state from its last authoritative timestamp to `now`. */
export function simulateTo(state: GameState, now: number, random: () => number = Math.random): GameState {
  const safeNow = Math.max(now, state.lastSimulatedAt)
  if (safeNow === state.lastSimulatedAt) return state

  const hiringBoard = [...state.hiringBoard]
  let nextWorkerCandidateAt = state.nextWorkerCandidateAt
  let workerCandidateSequence = state.workerCandidateSequence

  while (
    nextWorkerCandidateAt !== null &&
    nextWorkerCandidateAt <= safeNow &&
    hiringBoard.some((worker) => worker === null)
  ) {
    const openSlot = hiringBoard.findIndex((worker) => worker === null)
    hiringBoard[openSlot] = generateWorker(workerCandidateSequence, random)
    workerCandidateSequence += 1
    nextWorkerCandidateAt += WORKER_CANDIDATE_INTERVAL_MS
  }

  if (hiringBoard.every(Boolean)) nextWorkerCandidateAt = null

  return {
    ...state,
    lastSimulatedAt: safeNow,
    hiringBoard,
    nextWorkerCandidateAt,
    workerCandidateSequence,
  }
}

export function isMissionComplete(mission: Mission, now: number): boolean {
  return mission.claimedAt === undefined && now >= mission.completesAt
}
