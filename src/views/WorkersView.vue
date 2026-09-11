<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import characterIcon from '../assets/icons/1-game/character.svg'
import crossIcon from '../assets/icons/8-ui/cross.svg'
import RoughFrame from '../components/RoughFrame.vue'
import { useGameStore } from '../game/client/gameStore'
import type { Worker } from '../game/domain/gameState'

const game = useGameStore()
const slots = computed(() => game.state?.workerSlots ?? [null, null, null])
const filledSlots = computed(() => slots.value.filter(Boolean).length)
const managingCrew = ref(false)
const workerToFire = ref<Worker | null>(null)
const confirmationDialog = ref<HTMLDialogElement | null>(null)

function requestFire(worker: Worker) {
  workerToFire.value = worker
  confirmationDialog.value?.showModal()
}

function cancelFire() {
  confirmationDialog.value?.close()
}

async function confirmFire() {
  if (!workerToFire.value) return
  await game.fireWorker(workerToFire.value.id)
  confirmationDialog.value?.close()
  if (filledSlots.value === 0) managingCrew.value = false
}
</script>

<template>
  <section>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-bold uppercase tracking-[0.18em] text-fuchsia-700 dark:text-fuchsia-300">Your crew</p>
        <h2 class="mt-1 text-3xl font-black text-slate-950 dark:text-white">Worker slots</h2>
        <p class="mt-2 text-slate-600 dark:text-slate-300">Workers will handle workshop tasks on your behalf.</p>
      </div>
      <div class="flex items-center gap-3">
        <p class="font-bold text-cyan-700 dark:text-cyan-300">{{ filledSlots }} / 3 filled</p>
        <button
          class="rounded-xl border-2 border-slate-300 px-3 py-2 text-sm font-black text-slate-600 transition enabled:hover:border-cyan-500 enabled:hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:enabled:hover:border-cyan-400 dark:enabled:hover:text-cyan-300"
          :class="{ 'border-cyan-500 text-cyan-700 dark:border-cyan-400 dark:text-cyan-300': managingCrew }"
          :disabled="filledSlots === 0"
          @click="managingCrew = !managingCrew"
        >
          {{ managingCrew ? 'Done' : 'Manage crew' }}
        </button>
      </div>
    </div>
    <div class="mt-7 grid gap-5 md:grid-cols-3">
      <RoughFrame v-for="(worker, index) in slots" :key="worker?.id ?? index" :fill="worker ? 'rgb(34 211 238 / 0.08)' : 'rgb(148 163 184 / 0.06)'" :stroke="worker ? '#0891b2' : '#94a3b8'" :seed="71 + index * 19" :roughness="1.7">
        <article class="flex min-h-64 flex-col p-6">
          <div class="flex h-8 items-center justify-between">
            <h3 v-if="worker" class="text-xl font-black text-slate-950 dark:text-white">{{ worker.name }}</h3>
            <span
              v-if="!worker || !managingCrew"
              class="ml-auto text-xs font-black uppercase tracking-[0.18em] text-slate-500"
            >
              Slot {{ index + 1 }}
            </span>
            <button
              v-if="worker && managingCrew"
              class="absolute -right-2 -top-2 z-20 grid size-10 place-items-center rounded-full bg-red-600 shadow-lg shadow-red-950/25 transition hover:scale-105 hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:bg-red-700 dark:hover:bg-red-600"
              :aria-label="`Fire ${worker.name}`"
              @click="requestFire(worker)"
            >
              <img class="size-4 invert" :src="crossIcon" alt="">
            </button>
          </div>
          <template v-if="worker">
            <div class="mt-5 grid size-14 place-items-center rounded-2xl bg-cyan-200 dark:bg-cyan-900" aria-hidden="true">
              <img class="size-10 opacity-75 dark:invert" :src="characterIcon" alt="">
            </div>
            <p class="mt-4 font-bold text-fuchsia-700 dark:text-fuchsia-300">{{ worker.role }}</p>
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

  <Teleport to="body">
    <dialog
      ref="confirmationDialog"
      class="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border-2 border-red-300 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/75 dark:border-red-900 dark:bg-slate-900 dark:text-white"
      aria-labelledby="fire-worker-title"
      @cancel="workerToFire = null"
      @close="workerToFire = null"
    >
      <div class="p-6 sm:p-7">
        <div class="grid size-12 place-items-center rounded-xl bg-red-100 text-2xl text-red-700 dark:bg-red-950 dark:text-red-300" aria-hidden="true">!</div>
        <h2 id="fire-worker-title" class="mt-5 text-2xl font-black">Fire {{ workerToFire?.name }}?</h2>
        <p class="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
          This will remove {{ workerToFire?.name }} from your crew and leave their worker slot empty.
        </p>
        <div class="mt-7 flex justify-end gap-3">
          <button class="rounded-xl border-2 border-slate-300 px-4 py-2 font-black text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" @click="cancelFire">
            Keep worker
          </button>
          <button class="rounded-xl bg-red-500 px-4 py-2 font-black text-white transition hover:bg-red-400" @click="confirmFire">
            Fire worker
          </button>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>
