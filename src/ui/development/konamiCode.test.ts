import { describe, expect, it, vi } from 'vitest'
import { createKonamiCodeTracker, KONAMI_CODE } from './konamiCode'

describe('createKonamiCodeTracker', () => {
  it('completes after the full Konami code', () => {
    const onComplete = vi.fn()
    const tracker = createKonamiCodeTracker(onComplete)

    KONAMI_CODE.forEach((key) => tracker.accept(key))

    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('accepts uppercase letter keys', () => {
    const onComplete = vi.fn()
    const tracker = createKonamiCodeTracker(onComplete)

    KONAMI_CODE.forEach((key) => tracker.accept(key === 'a' || key === 'b' ? key.toUpperCase() : key))

    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('does not complete after a broken sequence', () => {
    const onComplete = vi.fn()
    const tracker = createKonamiCodeTracker(onComplete)

    KONAMI_CODE.slice(0, -1).forEach((key) => tracker.accept(key))
    tracker.accept('Escape')
    tracker.accept('Enter')

    expect(onComplete).not.toHaveBeenCalled()
  })
})
