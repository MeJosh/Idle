<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import RoughFrame from './components/RoughFrame.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { useGameStore } from './game/client/gameStore'
import { useTheme } from './ui/theme/useTheme'

const game = useGameStore()
const { theme } = useTheme()
const roughPalette = computed(() =>
  theme.value === 'dark'
    ? { stroke: '#22d3ee', fill: 'rgb(15 23 42 / 0.38)' }
    : { stroke: '#0891b2', fill: 'rgb(255 255 255 / 0.48)' },
)

onMounted(() => game.start())
onUnmounted(() => game.stop())
</script>

<template>
  <main class="mx-auto min-h-svh w-full max-w-6xl px-4 py-8 sm:px-8 lg:px-12">
    <RoughFrame class="w-full" :fill="roughPalette.fill" :stroke="roughPalette.stroke" :seed="17" :roughness="1.15">
      <section class="m-2 overflow-hidden rounded-2xl bg-white/75 shadow-2xl shadow-cyan-800/15 dark:bg-slate-950/72 dark:shadow-cyan-950/40">
        <header class="border-b-2 border-dashed border-cyan-300/80 px-6 pt-5 sm:px-8 dark:border-cyan-900/60">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-4">
              <div class="grid size-12 rotate-2 place-items-center rounded-xl bg-cyan-300 text-2xl text-slate-950 shadow-lg shadow-cyan-500/20" aria-hidden="true">🔧</div>
              <div>
                <p class="text-sm font-bold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">Idle workshop</p>
                <h1 class="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">Build a crew. Keep it moving.</h1>
              </div>
            </div>
            <div class="flex items-center justify-between gap-3 sm:justify-end">
              <span class="text-sm font-bold text-emerald-700 dark:text-emerald-300">● Save secured</span>
              <ThemeToggle />
            </div>
          </div>
          <nav class="mt-6 flex gap-2" aria-label="Workshop">
            <RouterLink class="nav-tab" to="/workers">Workers</RouterLink>
            <RouterLink class="nav-tab" to="/hiring">Hiring</RouterLink>
          </nav>
        </header>
        <div class="p-5 sm:p-8 lg:p-10">
          <p v-if="game.error" class="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-700 dark:text-red-200">{{ game.error }}</p>
          <RouterView />
        </div>
      </section>
    </RoughFrame>
  </main>
</template>
