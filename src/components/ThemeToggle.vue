<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '../ui/theme/useTheme'

const { theme, toggleTheme } = useTheme()
const nextTheme = computed(() => (theme.value === 'dark' ? 'light' : 'dark'))
</script>

<template>
  <button
    type="button"
    class="grid size-11 place-items-center rounded-xl border-2 border-slate-300 bg-white/80 text-xl text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:border-slate-700 dark:bg-slate-900/90 dark:text-amber-200 dark:hover:border-cyan-400"
    :aria-label="`Switch to ${nextTheme} mode`"
    :title="`Switch to ${nextTheme} mode`"
    @click="toggleTheme"
  >
    <span aria-hidden="true">{{ theme === 'dark' ? '☾' : '☀' }}</span>
  </button>
</template>
