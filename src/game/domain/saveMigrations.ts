import { gt, lte, satisfies, valid } from 'semver'
import { APP_VERSION } from '../../version'
import { isGameState, type GameState } from './gameState'
import { WORKER_CANDIDATE_INTERVAL_MS } from './workerGenerator'

export const CURRENT_SAVE_VERSION = APP_VERSION

export interface SaveData {
  version: string
  state: GameState
}

export interface SaveMigrationResult {
  save: SaveData
  migratedFrom: string | null
}

interface SaveMigration {
  from: string
  to: string
  transform(state: unknown): unknown
}

const migrations: SaveMigration[] = [
  {
    from: '<0.1.0',
    to: '0.1.0',
    transform(state) {
      if (!state || typeof state !== 'object') return state
      return { missions: [], ...state }
    },
  },
  {
    from: '<0.2.0',
    to: '0.2.0',
    transform(state) {
      if (!state || typeof state !== 'object') return state
      const { points: _points, pointsPerSecond: _pointsPerSecond, ...rest } = state as Record<
        string,
        unknown
      >
      return { ...rest, workerSlots: [null, null, null] }
    },
  },
  {
    from: '<0.3.0',
    to: '0.3.0',
    transform(state) {
      if (!state || typeof state !== 'object') return state
      const record = state as Record<string, unknown>
      const lastSimulatedAt =
        typeof record.lastSimulatedAt === 'number' ? record.lastSimulatedAt : 0
      const workerSlots = Array.isArray(record.workerSlots)
        ? record.workerSlots.map((worker) => {
            if (!worker || typeof worker !== 'object') return worker
            return { ...(worker as Record<string, unknown>), rarity: 'Common' }
          })
        : record.workerSlots

      return {
        ...record,
        workerSlots,
        hiringBoard: [null, null, null],
        nextWorkerCandidateAt: lastSimulatedAt + WORKER_CANDIDATE_INTERVAL_MS,
        workerCandidateSequence: 0,
      }
    },
  },
]

export class SaveMigrationError extends Error {
  readonly code: 'invalid-save' | 'newer-save'

  constructor(code: 'invalid-save' | 'newer-save', message: string) {
    super(message)
    this.name = 'SaveMigrationError'
    this.code = code
  }
}

/** Converts a stored save into the current schema without mutating the input. */
export function migrateSave(value: unknown): SaveMigrationResult {
  if (!value || typeof value !== 'object') {
    throw new SaveMigrationError('invalid-save', 'The stored save is not a valid object.')
  }

  const envelope = value as { version?: unknown; state?: unknown }
  const sourceVersion = normalizeVersion(envelope.version)

  if (gt(sourceVersion, CURRENT_SAVE_VERSION)) {
    throw new SaveMigrationError(
      'newer-save',
      `This save was written by newer app version ${sourceVersion}. Update the app before loading it.`,
    )
  }

  let workingVersion = sourceVersion
  let state = structuredClone(envelope.state)
  const appliedMigrations = new Set<string>()

  while (workingVersion !== CURRENT_SAVE_VERSION) {
    const migration = migrations.find(
      (candidate) =>
        !appliedMigrations.has(candidate.to) &&
        satisfies(workingVersion, candidate.from) &&
        gt(candidate.to, workingVersion) &&
        lte(candidate.to, CURRENT_SAVE_VERSION),
    )

    if (!migration) break
    state = migration.transform(state)
    workingVersion = migration.to
    appliedMigrations.add(migration.to)
  }

  if (!isGameState(state)) {
    throw new SaveMigrationError(
      'invalid-save',
      `Save version ${sourceVersion} could not be migrated safely. The original save was preserved.`,
    )
  }

  return {
    save: { version: CURRENT_SAVE_VERSION, state: structuredClone(state) },
    migratedFrom: sourceVersion === CURRENT_SAVE_VERSION ? null : sourceVersion,
  }
}

function normalizeVersion(version: unknown): string {
  // Numeric version 1 was used before saves adopted the package's semantic version.
  if (version === 1) return '0.0.0'

  if (typeof version === 'string') {
    const normalized = valid(version)
    if (normalized) return normalized
  }

  throw new SaveMigrationError('invalid-save', 'The stored save has an invalid version.')
}
