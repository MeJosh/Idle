import { onMounted, onUnmounted } from 'vue'
import { createKonamiCodeTracker } from './konamiCode'

export function useKonamiCode(onComplete: () => void) {
  const tracker = createKonamiCodeTracker(onComplete)

  function handleKeydown(event: KeyboardEvent) {
    const target = event.target
    const isEditable = target instanceof HTMLElement && (
      target.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)
    )

    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || isEditable) {
      tracker.reset()
      return
    }

    tracker.accept(event.key)
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

  return {
    reset: tracker.reset,
  }
}
