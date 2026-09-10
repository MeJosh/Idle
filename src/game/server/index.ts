import { createGameServer } from './gameServer'
import { LocalStorageGameRepository } from './localStorageGameRepository'

export const gameServer = createGameServer(new LocalStorageGameRepository(), {
  now: () => Date.now(),
})
