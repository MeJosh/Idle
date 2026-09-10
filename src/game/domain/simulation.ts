import type { GameState, Mission } from './gameState'

const MILLISECONDS_PER_SECOND = 1_000

/** Advances state from its last authoritative timestamp to `now`. */
export function simulateTo(state: GameState, now: number): GameState {
  const safeNow = Math.max(now, state.lastSimulatedAt)
  const elapsedSeconds = (safeNow - state.lastSimulatedAt) / MILLISECONDS_PER_SECOND

  if (elapsedSeconds === 0) return state

  return {
    ...state,
    points: state.points + elapsedSeconds * state.pointsPerSecond,
    lastSimulatedAt: safeNow,
  }
}

export function isMissionComplete(mission: Mission, now: number): boolean {
  return mission.claimedAt === undefined && now >= mission.completesAt
}
