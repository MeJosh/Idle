import type { GameState, Worker } from './gameState'

export const WORKER_CANDIDATES: readonly Worker[] = [
  {
    id: 'mara-vale',
    name: 'Mara Vale',
    role: 'Scavenger',
    specialty: 'Finds useful parts in unlikely places.',
  },
  {
    id: 'orin-pike',
    name: 'Orin Pike',
    role: 'Tinkerer',
    specialty: 'Keeps temperamental machines running.',
  },
  {
    id: 'sable-reed',
    name: 'Sable Reed',
    role: 'Courier',
    specialty: 'Finishes delivery jobs ahead of schedule.',
  },
]

export function hireWorker(state: GameState, workerId: string): GameState {
  const openSlot = state.workerSlots.findIndex((slot) => slot === null)
  if (openSlot === -1) throw new Error('All worker slots are full.')

  const worker = WORKER_CANDIDATES.find((candidate) => candidate.id === workerId)
  if (!worker) throw new Error('That worker is not available.')

  if (state.workerSlots.some((slot) => slot?.id === workerId)) {
    throw new Error(`${worker.name} already works here.`)
  }

  const workerSlots = [...state.workerSlots]
  workerSlots[openSlot] = { ...worker }
  return { ...state, workerSlots }
}
