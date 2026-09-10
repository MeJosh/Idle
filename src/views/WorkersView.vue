<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import RoughFrame from '../components/RoughFrame.vue'
import { useGameStore } from '../game/client/gameStore'

const game = useGameStore()
const slots = computed(() => game.state?.workerSlots ?? [null, null, null])
const filledSlots = computed(() => slots.value.filter(Boolean).length)
</script>

<template>
  <section>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-bold uppercase tracking-[0.18em] text-fuchsia-700 dark:text-fuchsia-300">Your crew</p>
        <h2 class="mt-1 text-3xl font-black text-slate-950 dark:text-white">Worker slots</h2>
        <p class="mt-2 text-slate-600 dark:text-slate-300">Workers will handle workshop tasks on your behalf.</p>
      </div>
      <p class="font-bold text-cyan-700 dark:text-cyan-300">{{ filledSlots }} / 3 filled</p>
    </div>
    <div class="mt-7 grid gap-5 md:grid-cols-3">
      <RoughFrame v-for="(worker, index) in slots" :key="worker?.id ?? index" :fill="worker ? 'rgb(34 211 238 / 0.08)' : 'rgb(148 163 184 / 0.06)'" :stroke="worker ? '#0891b2' : '#94a3b8'" :seed="71 + index * 19" :roughness="1.7">
        <article class="flex min-h-64 flex-col p-6">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Slot {{ index + 1 }}</span>
            <span class="text-2xl" aria-hidden="true">{{ worker ? '●' : '○' }}</span>
          </div>
          <template v-if="worker">
            <div class="mt-7 grid size-14 place-items-center rounded-2xl bg-cyan-200 text-2xl text-slate-900 dark:bg-cyan-900 dark:text-cyan-100">👤</div>
            <h3 class="mt-4 text-xl font-black text-slate-950 dark:text-white">{{ worker.name }}</h3>
            <p class="mt-1 font-bold text-fuchsia-700 dark:text-fuchsia-300">{{ worker.role }}</p>
            <p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{{ worker.specialty }}</p>
          </template>
          <template v-else>
            <div class="flex flex-1 flex-col items-center justify-center py-8 text-center">
              <p class="text-lg font-black text-slate-500 dark:text-slate-400">Empty station</p>
              <p class="mt-2 text-sm text-slate-500">Hire someone to put this slot to work.</p>
              <RouterLink
                aria-label="Visit hiring"
                class="mt-5 grid size-10 place-items-center rounded-full border-2 border-slate-400 bg-transparent text-xl font-black text-slate-500 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-500 dark:text-slate-400 dark:hover:bg-slate-800"
                to="/hiring"
              >
                +
              </RouterLink>
            </div>
          </template>
        </article>
      </RoughFrame>
    </div>
  </section>
</template>
