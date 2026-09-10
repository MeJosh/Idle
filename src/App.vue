<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import RoughFrame from './components/RoughFrame.vue'
import { useGameStore } from './game/client/gameStore'

const game = useGameStore()
const displayedPoints = computed(() => Math.floor(game.state?.points ?? 0).toLocaleString())
const progress = computed(() => ((game.state?.points ?? 0) % 10) * 10)

onMounted(() => game.start())
onUnmounted(() => game.stop())
</script>

<template>
  <main class="mx-auto flex min-h-svh w-full max-w-6xl items-center px-4 py-8 sm:px-8 lg:px-12">
    <RoughFrame
      class="w-full"
      fill="rgb(15 23 42 / 0.38)"
      stroke="#22d3ee"
      :seed="17"
      :roughness="1.15"
    >
      <section class="m-2 overflow-hidden rounded-2xl bg-slate-950/72 shadow-2xl shadow-cyan-950/40">
        <header class="flex flex-col gap-4 border-b-2 border-dashed border-cyan-900/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div class="flex items-center gap-4">
            <div class="grid size-12 rotate-2 place-items-center rounded-xl bg-cyan-300 text-2xl text-slate-950 shadow-lg shadow-cyan-500/20" aria-hidden="true">
              ⚡
            </div>
            <div>
              <p class="text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">Idle workshop</p>
              <h1 class="mt-1 text-2xl font-black tracking-tight text-white">The engine never sleeps</h1>
            </div>
          </div>

          <RoughFrame class="w-fit" fill="rgb(52 211 153 / 0.08)" stroke="#6ee7b7" :seed="33" :roughness="1.8">
            <span class="relative block px-5 py-2 text-sm font-bold text-emerald-200">● Save secured</span>
          </RoughFrame>
        </header>

        <div class="grid gap-7 p-5 sm:p-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-10 lg:p-10">
          <RoughFrame fill="rgb(8 145 178 / 0.06)" stroke="#f0abfc" :seed="71" :roughness="1.7">
            <div class="flex min-h-80 flex-col justify-center px-7 py-9 sm:px-10">
              <div class="flex items-center gap-3">
                <span class="text-2xl" aria-hidden="true">✦</span>
                <p class="text-base font-bold uppercase tracking-[0.18em] text-fuchsia-300">Energy points</p>
              </div>

              <p class="mt-3 break-all text-6xl font-black tracking-tight text-white drop-shadow-[3px_3px_0_#701a75] sm:text-8xl" aria-live="polite">
                {{ game.loading ? '—' : displayedPoints }}
              </p>

              <div class="mt-7 max-w-xl">
                <div class="mb-2 flex items-center justify-between gap-4 text-sm font-semibold">
                  <span class="text-slate-300">Generator charge</span>
                  <span class="text-cyan-300">+{{ game.state?.pointsPerSecond ?? 1 }}/sec</span>
                </div>
                <div class="h-3 overflow-hidden rounded-full bg-slate-800 ring-2 ring-slate-700">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400 transition-[width] duration-300"
                    :style="{ width: `${progress}%` }"
                  />
                </div>
              </div>

              <p class="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
                The workshop earns while you’re away. Close the tab, come back later, and your engine will catch up.
              </p>

              <p v-if="game.error" class="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
                {{ game.error }}
              </p>
            </div>
          </RoughFrame>

          <RoughFrame fill="rgb(245 158 11 / 0.05)" stroke="#fbbf24" :seed="109" :roughness="1.9">
            <aside class="h-full px-7 py-8">
              <p class="text-2xl" aria-hidden="true">☄</p>
              <h2 class="mt-3 text-xl font-black text-amber-200">Workshop systems</h2>
              <dl class="mt-7 space-y-6 text-sm">
                <div>
                  <dt class="font-bold uppercase tracking-wider text-slate-500">Control deck</dt>
                  <dd class="mt-1 text-base font-semibold text-slate-100">Pinia read model</dd>
                </div>
                <div>
                  <dt class="font-bold uppercase tracking-wider text-slate-500">Engine core</dt>
                  <dd class="mt-1 text-base font-semibold text-slate-100">Local game server</dd>
                </div>
                <div>
                  <dt class="font-bold uppercase tracking-wider text-slate-500">Memory vault</dt>
                  <dd class="mt-1 text-base font-semibold text-slate-100">Versioned save</dd>
                </div>
                <div>
                  <dt class="font-bold uppercase tracking-wider text-slate-500">Time drive</dt>
                  <dd class="mt-1 text-base font-semibold text-slate-100">Offline simulation</dd>
                </div>
              </dl>
            </aside>
          </RoughFrame>
        </div>
      </section>
    </RoughFrame>
  </main>
</template>
