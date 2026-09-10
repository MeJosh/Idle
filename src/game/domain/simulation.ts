import type { GameState, Mission } from './gameState'

/** Advances state from its last authoritative timestamp to `now`. */
export function simulateTo(state: GameState, now: number): GameState {
  const safeNow = Math.max(now, state.lastSimulatedAt)
  if (safeNow === state.lastSimulatedAt) return state

  return {
    ...state,
    lastSimulatedAt: safeNow,
  }
}

export function isMissionComplete(mission: Mission, now: number): boolean {
  return mission.claimedAt === undefined && now >= mission.completesAt
}
