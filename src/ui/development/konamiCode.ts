export const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
  'Enter',
] as const

function normalizeKey(key: string) {
  return key.length === 1 ? key.toLowerCase() : key
}

export function createKonamiCodeTracker(onComplete: () => void) {
  let nextKeyIndex = 0

  return {
    accept(key: string) {
      const normalizedKey = normalizeKey(key)

      if (normalizedKey === KONAMI_CODE[nextKeyIndex]) {
        nextKeyIndex += 1

        if (nextKeyIndex === KONAMI_CODE.length) {
          nextKeyIndex = 0
          onComplete()
        }

        return
      }

      nextKeyIndex = normalizedKey === KONAMI_CODE[0] ? 1 : 0
    },
    reset() {
      nextKeyIndex = 0
    },
  }
}
