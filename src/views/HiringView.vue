<script setup lang="ts">
import { computed } from 'vue'
import characterIcon from '../assets/icons/1-game/character.svg'
import RoughFrame from '../components/RoughFrame.vue'
import { useGameStore } from '../game/client/gameStore'
import { WORKER_CANDIDATES } from '../game/domain/workers'

const game = useGameStore()
const hasOpenSlot = computed(() => game.state?.workerSlots.some((slot) => slot === null) ?? false)
const isHired = (workerId: string) => game.state?.workerSlots.some((slot) => slot?.id === workerId) ?? false
const hiringSlots = computed(() =>
  WORKER_CANDIDATES.map((worker) => (isHired(worker.id) ? null : worker)),
)
</script>

<template>
  <section>
    <div>
      <p class="text-sm font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Available talent</p>
      <h2 class="mt-1 text-3xl font-black text-slate-950 dark:text-white">Hiring board</h2>
      <p class="mt-2 text-slate-600 dark:text-slate-300">Choose a worker to fill the next open slot.</p>
    </div>
    <div class="mt-7 grid gap-5 md:grid-cols-3">
      <RoughFrame
        v-for="(worker, index) in hiringSlots"
        :key="worker?.id ?? `empty-${index}`"
        :fill="worker ? 'rgb(245 158 11 / 0.06)' : 'rgb(148 163 184 / 0.06)'"
        :stroke="worker ? '#d97706' : '#94a3b8'"
        :seed="109 + index * 23"
        :roughness="1.8"
      >
        <article class="flex min-h-72 flex-col p-6">
          <template v-if="worker">
            <div class="grid size-14 place-items-center rounded-2xl bg-amber-200 dark:bg-amber-900" aria-hidden="true">
              <img class="size-10 opacity-75 dark:invert" :src="characterIcon" alt="">
            </div>
            <h3 class="mt-4 text-xl font-black text-slate-950 dark:text-white">{{ worker.name }}</h3>
            <p class="mt-1 font-bold text-amber-700 dark:text-amber-300">{{ worker.role }}</p>
            <p class="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{{ worker.specialty }}</p>
            <button
              class="mt-6 rounded-xl bg-amber-400 px-4 py-3 font-black text-slate-950 shadow-md shadow-amber-500/20 transition enabled:hover:-translate-y-0.5 enabled:hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-45"
              :disabled="!hasOpenSlot"
              @click="game.hireWorker(worker.id)"
            >
              {{ hasOpenSlot ? 'Hire worker' : 'Slots full' }}
            </button>
          </template>
          <div v-else class="flex flex-1 flex-col items-center justify-center text-center">
            <span class="text-4xl text-slate-400 dark:text-slate-600" aria-hidden="true">○</span>
            <h3 class="mt-4 text-lg font-black text-slate-500 dark:text-slate-400">Empty hiring slot</h3>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-500">A new candidate can appear here later.</p>
          </div>
        </article>
      </RoughFrame>
    </div>
  </section>
</template>
