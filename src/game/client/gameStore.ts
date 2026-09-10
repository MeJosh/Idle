import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GameState } from '../domain/gameState'
import { gameServer } from '../server'
import type { GameService } from './gameService'

const SYNC_INTERVAL_MS = 1_000
const service: GameService = gameServer

export const useGameStore = defineStore('game', () => {
  const state = ref<GameState | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)
  let timer: ReturnType<typeof setInterval> | undefined

  async function sync() {
    try {
      state.value = await service.sync()
      error.value = null
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'The game could not be synchronized.'
    }
  }

  async function start() {
    if (timer) return

    loading.value = true
    try {
      state.value = await service.initialize()
      error.value = null
      timer = setInterval(sync, SYNC_INTERVAL_MS)
      document.addEventListener('visibilitychange', handleVisibilityChange)
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'The game could not be loaded.'
    } finally {
      loading.value = false
    }
  }

  async function hireWorker(workerId: string) {
    try {
      state.value = await service.hireWorker(workerId)
      error.value = null
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'The worker could not be hired.'
    }
  }

  async function fireWorker(workerId: string) {
    try {
      state.value = await service.fireWorker(workerId)
      error.value = null
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'The worker could not be fired.'
    }
  }

  function handleVisibilityChange() {
    if (document.visibilityState === 'visible') void sync()
  }

  function stop() {
    if (timer) clearInterval(timer)
    timer = undefined
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    void sync()
  }

  return { state, loading, error, start, stop, sync, hireWorker, fireWorker }
})
