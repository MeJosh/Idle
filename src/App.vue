<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from './game/client/gameStore'

const game = useGameStore()
const displayedPoints = computed(() => Math.floor(game.state?.points ?? 0).toLocaleString())

onMounted(() => game.start())
onUnmounted(() => game.stop())
</script>

<template>
  <main class="mx-auto flex min-h-svh w-full max-w-6xl items-center px-5 py-10 sm:px-8 lg:px-12">
    <section class="w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-cyan-950/30">
      <header class="flex flex-col gap-3 border-b border-slate-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Idle prototype</p>
          <h1 class="mt-1 text-xl font-semibold text-white">Simulation foundation</h1>
        </div>
        <span class="w-fit rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
          Saved locally
        </span>
      </header>

      <div class="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12 lg:p-12">
        <div class="flex min-h-72 flex-col justify-center">
          <p class="text-sm text-slate-400">Total points</p>
          <p class="mt-2 break-all text-6xl font-bold tracking-tight text-white sm:text-7xl" aria-live="polite">
            {{ game.loading ? '—' : displayedPoints }}
          </p>
          <p class="mt-4 text-base text-slate-300">
            Earning {{ game.state?.pointsPerSecond ?? 1 }} point per second, including while this tab is closed.
          </p>
          <p v-if="game.error" class="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
            {{ game.error }}
          </p>
        </div>

        <aside class="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-6">
          <h2 class="text-base font-semibold text-white">Architecture check</h2>
          <dl class="mt-6 space-y-5 text-sm">
            <div><dt class="text-slate-500">UI state</dt><dd class="mt-1 text-slate-200">Pinia read model</dd></div>
            <div><dt class="text-slate-500">Authority</dt><dd class="mt-1 text-slate-200">Client-side game server</dd></div>
            <div><dt class="text-slate-500">Persistence</dt><dd class="mt-1 text-slate-200">Versioned local storage</dd></div>
            <div><dt class="text-slate-500">Simulation</dt><dd class="mt-1 text-slate-200">Timestamp-based, deterministic</dd></div>
          </dl>
        </aside>
      </div>
    </section>
  </main>
</template>
