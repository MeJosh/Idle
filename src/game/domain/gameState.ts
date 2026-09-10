export const SAVE_VERSION = 1 as const

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

export interface SaveData {
  version: typeof SAVE_VERSION
  state: GameState
}

export function createInitialGameState(now: number): GameState {
  return { points: 0, pointsPerSecond: 1, lastSimulatedAt: now, missions: [] }
}

export function isSaveData(value: unknown): value is SaveData {
  if (!value || typeof value !== 'object') return false

  const save = value as Partial<SaveData>
  const state = save.state as Partial<GameState> | undefined

  return (
    save.version === SAVE_VERSION &&
    !!state &&
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
