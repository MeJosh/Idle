import { readonly, ref } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'idle-game:theme'
const theme = ref<Theme>('light')
let followsSystem = true
let initialized = false

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

function applyTheme() {
  document.documentElement.classList.toggle('dark', theme.value === 'dark')
  document.documentElement.style.colorScheme = theme.value
}

function initializeTheme() {
  if (initialized) return
  initialized = true

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const systemTheme: Theme = mediaQuery.matches ? 'dark' : 'light'

  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY)
    if (isTheme(savedTheme)) {
      theme.value = savedTheme
      followsSystem = false
    } else {
      theme.value = systemTheme
    }
  } catch {
    theme.value = systemTheme
  }

  mediaQuery.addEventListener('change', (event) => {
    if (!followsSystem) return
    theme.value = event.matches ? 'dark' : 'light'
    applyTheme()
  })

  applyTheme()
}

export function useTheme() {
  initializeTheme()

  function toggleTheme() {
    followsSystem = false
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme()

    try {
      localStorage.setItem(STORAGE_KEY, theme.value)
    } catch {
      // The preference still applies for the current session.
    }
  }

  return {
    theme: readonly(theme),
    toggleTheme,
  }
}
