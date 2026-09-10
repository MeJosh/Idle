export interface Mission {
  id: string
  kind: string
  startedAt: number
  completesAt: number
  claimedAt?: number
}

export interface Worker {
  id: string
  name: string
  role: string
  specialty: string
}

export interface GameState {
  lastSimulatedAt: number
  missions: Mission[]
  workerSlots: Array<Worker | null>
}

export function createInitialGameState(now: number): GameState {
  return { lastSimulatedAt: now, missions: [], workerSlots: [null, null, null] }
}

export function isGameState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object') return false

  const state = value as Partial<GameState>

  return (
    isNonNegativeNumber(state.lastSimulatedAt) &&
    Array.isArray(state.missions) &&
    state.missions.every(isMission) &&
    Array.isArray(state.workerSlots) &&
    state.workerSlots.length === 3 &&
    state.workerSlots.every((worker) => worker === null || isWorker(worker)) &&
    workersAreUnique(state.workerSlots)
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

function isWorker(value: unknown): value is Worker {
  if (!value || typeof value !== 'object') return false

  const worker = value as Partial<Worker>
  return (
    typeof worker.id === 'string' &&
    typeof worker.name === 'string' &&
    typeof worker.role === 'string' &&
    typeof worker.specialty === 'string'
  )
}

function workersAreUnique(workerSlots: Array<Worker | null>): boolean {
  const ids = workerSlots.flatMap((worker) => (worker ? [worker.id] : []))
  return new Set(ids).size === ids.length
}
