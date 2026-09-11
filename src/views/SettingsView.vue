<script setup lang="ts">
import ThemeToggle from '../components/ThemeToggle.vue'
import { useDevelopmentMode } from '../ui/development/useDevelopmentMode'
import { useTheme } from '../ui/theme/useTheme'
import { APP_VERSION } from '../version'

const { theme } = useTheme()
const { developmentMode } = useDevelopmentMode()
</script>

<template>
  <section>
    <div>
      <p class="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Workshop controls</p>
      <h2 class="mt-1 text-3xl font-black text-slate-950 dark:text-white">Settings</h2>
      <p class="mt-2 text-slate-600 dark:text-slate-300">Tune the workshop to suit how you play.</p>
    </div>

    <div class="mt-7 overflow-hidden rounded-2xl border-2 border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-950/45">
      <div class="border-b-2 border-dashed border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
        <h3 class="text-lg font-black text-slate-950 dark:text-white">Appearance</h3>
      </div>
      <div class="flex items-center justify-between gap-6 px-5 py-5 sm:px-6">
        <div>
          <p class="font-black text-slate-900 dark:text-slate-100">Color theme</p>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Currently using {{ theme }} mode.
          </p>
        </div>
        <ThemeToggle />
      </div>
    </div>

    <div
      v-if="developmentMode"
      class="mt-5 overflow-hidden rounded-2xl border-2 border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-950/45"
    >
      <div class="px-5 py-4 sm:px-6">
        <h3 class="text-lg font-black text-slate-950 dark:text-white">Development</h3>
      </div>
    </div>

    <p class="mt-6 text-center text-xs font-medium text-slate-400 dark:text-slate-600">
      Version {{ APP_VERSION }}
    </p>
  </section>
</template>
