import type { GameState } from '../domain/gameState'

/** The client-facing contract can later be implemented by an HTTP adapter. */
export interface GameService {
  initialize(): Promise<GameState>
  sync(): Promise<GameState>
  hireWorker(workerId: string): Promise<GameState>
}
