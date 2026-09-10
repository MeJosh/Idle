export interface Mission {
  id: string
  kind: string
  startedAt: number
  completesAt: number
  claimedAt?: number
}

export interface GameState {
  points: number
  pointsPerSecond: number
  lastSimulatedAt: number
  missions: Mission[]
}

export function createInitialGameState(now: number): GameState {
  return { points: 0, pointsPerSecond: 1, lastSimulatedAt: now, missions: [] }
}

export function isGameState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object') return false

  const state = value as Partial<GameState>

  return (
    isNonNegativeNumber(state.points) &&
    isNonNegativeNumber(state.pointsPerSecond) &&
    isNonNegativeNumber(state.lastSimulatedAt) &&
    Array.isArray(state.missions) &&
    state.missions.every(isMission)
  )
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function isMission(value: unknown): value is Mission {
  if (!value || typeof value !== 'object') return false

  const mission = value as Partial<Mission>
  return (
    typeof mission.id === 'string' &&
    typeof mission.kind === 'string' &&
    isNonNegativeNumber(mission.startedAt) &&
    isNonNegativeNumber(mission.completesAt) &&
    mission.completesAt >= mission.startedAt &&
    (mission.claimedAt === undefined || isNonNegativeNumber(mission.claimedAt))
  )
}
