<script setup lang="ts">
import { computed, ref } from 'vue'
import characterIcon from '../assets/icons/1-game/character.svg'
import RoughFrame from '../components/RoughFrame.vue'
import { useGameStore } from '../game/client/gameStore'
import type { Worker } from '../game/domain/gameState'
import { RARITY_COLORS } from '../game/domain/workerGenerator'
import Dialog from '../volt/Dialog.vue'

const game = useGameStore()
const hasOpenSlot = computed(() => game.state?.workerSlots.some((slot) => slot === null) ?? false)
const hiringSlots = computed(() => game.state?.hiringBoard ?? [null, null, null])
const workerSlots = computed(() => game.state?.workerSlots ?? [null, null, null])
const workerToHire = ref<Worker | null>(null)
const replacementDialogVisible = ref(false)
const secondsUntilCandidate = computed(() => {
  const state = game.state
  if (!state?.nextWorkerCandidateAt) return null
  return Math.max(0, Math.ceil((state.nextWorkerCandidateAt - state.lastSimulatedAt) / 1_000))
})

async function requestHire(worker: Worker) {
  if (hasOpenSlot.value) {
    await game.hireWorker(worker.id)
    return
  }

  workerToHire.value = worker
  replacementDialogVisible.value = true
}

async function replaceWorker(slot: number) {
  if (!workerToHire.value) return
  await game.hireWorker(workerToHire.value.id, slot)
  replacementDialogVisible.value = false
}

function cancelReplacement() {
  replacementDialogVisible.value = false
}

function clearWorkerToHire() {
  workerToHire.value = null
}
</script>

<template>
  <section>
    <div>
      <p class="text-sm font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Available talent</p>
      <h2 class="mt-1 text-3xl font-black text-slate-950 dark:text-white">Hiring board</h2>
      <p class="mt-2 text-slate-600 dark:text-slate-300">
        Candidates arrive over time. Hire into an open slot or replace a member of your crew.
      </p>
    </div>
    <div class="mt-7 grid gap-5 md:grid-cols-3">
      <RoughFrame
        v-for="(worker, index) in hiringSlots"
        :key="worker?.id ?? `empty-${index}`"
        :fill="worker ? `${RARITY_COLORS[worker.rarity].hex}14` : 'rgb(148 163 184 / 0.06)'"
        :stroke="worker ? RARITY_COLORS[worker.rarity].hex : '#94a3b8'"
        :seed="109 + index * 23"
        :roughness="1.8"
      >
        <article class="flex h-full min-h-72 flex-col p-6">
          <template v-if="worker">
            <div class="flex h-8 items-center justify-between gap-3">
              <h3 class="text-xl font-black text-slate-950 dark:text-white">{{ worker.name }}</h3>
              <span
                class="rounded-full border px-2.5 py-1 text-xs font-black uppercase tracking-wider text-slate-900"
                :style="{ backgroundColor: RARITY_COLORS[worker.rarity].hex, borderColor: RARITY_COLORS[worker.rarity].hex }"
              >
                {{ worker.rarity }}
              </span>
            </div>
            <div class="mt-5 grid size-14 place-items-center rounded-2xl bg-amber-200 dark:bg-amber-900" aria-hidden="true">
              <img class="size-10 opacity-75 dark:invert" :src="characterIcon" alt="">
            </div>
            <p class="mt-4 font-bold text-amber-700 dark:text-amber-300">{{ worker.role }}</p>
            <p class="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{{ worker.specialty }}</p>
            <button
              class="mt-6 rounded-xl bg-amber-400 px-4 py-3 font-black text-slate-950 shadow-md shadow-amber-500/20 transition enabled:hover:-translate-y-0.5 enabled:hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-45"
              @click="requestHire(worker)"
            >
              {{ hasOpenSlot ? 'Hire worker' : 'Choose replacement' }}
            </button>
          </template>
          <div v-else class="flex flex-1 flex-col items-center justify-center text-center">
            <span class="text-4xl text-slate-400 dark:text-slate-600" aria-hidden="true">○</span>
            <h3 class="mt-4 text-lg font-black text-slate-500 dark:text-slate-400">Empty hiring slot</h3>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-500">
              {{ secondsUntilCandidate === null ? 'The board is currently full.' : `Next arrival in ${secondsUntilCandidate}s.` }}
            </p>
          </div>
        </article>
      </RoughFrame>
    </div>
  </section>

  <Dialog
    v-model:visible="replacementDialogVisible"
    modal
    dismissable-mask
    :show-header="false"
    :pt="{ content: { class: 'p-0' }, mask: { class: 'bg-slate-950/75' } }"
    class="m-auto w-[calc(100%-2rem)] !max-w-lg !rounded-2xl !border-2 !border-amber-300 !bg-white !p-0 !text-slate-900 !shadow-2xl dark:!border-amber-900 dark:!bg-slate-900 dark:!text-white"
    aria-labelledby="replace-worker-title"
    @after-hide="clearWorkerToHire"
  >
    <div class="p-6 sm:p-7">
      <h2 id="replace-worker-title" class="text-2xl font-black">Who should {{ workerToHire?.name }} replace?</h2>
      <p class="mt-2 text-slate-600 dark:text-slate-300">The replaced worker will leave your crew.</p>
      <div class="mt-6 grid gap-3">
        <button
          v-for="(worker, index) in workerSlots"
          :key="worker?.id ?? index"
          class="flex items-center justify-between rounded-xl border-2 border-slate-300 px-4 py-3 text-left transition hover:border-amber-400 hover:bg-amber-50 dark:border-slate-700 dark:hover:border-amber-500 dark:hover:bg-slate-800"
          @click="replaceWorker(index)"
        >
          <span>
            <span class="block font-black">{{ worker?.name }}</span>
            <span class="block text-sm text-slate-500 dark:text-slate-400">{{ worker?.role }} · {{ worker?.rarity }}</span>
          </span>
          <span class="font-black text-amber-700 dark:text-amber-300">Replace</span>
        </button>
      </div>
      <div class="mt-6 flex justify-end">
        <button
          class="rounded-xl border-2 border-slate-300 px-4 py-2 font-black text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="cancelReplacement"
        >
          Cancel
        </button>
      </div>
    </div>
  </Dialog>
</template>
