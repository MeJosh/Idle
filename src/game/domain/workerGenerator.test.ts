import { describe, expect, it } from 'vitest'
import { generateWorker, parseWorkerConfig, pickWeightedRarity, RARITY_COLORS } from './workerGenerator'

describe('generateWorker', () => {
  it('combines names and produces stable unique ids from the sequence', () => {
    const worker = generateWorker(12, () => 0)

    expect(worker).toMatchObject({ id: 'candidate-12', name: 'Ada Ash', rarity: 'Common' })
  })
})

describe('weighted rarity', () => {
  const weights = { Common: 60, Uncommon: 25, Rare: 10, Epic: 5 }

  it.each([
    [0, 'Common'],
    [0.6, 'Uncommon'],
    [0.85, 'Rare'],
    [0.95, 'Epic'],
  ] as const)('maps a roll of %s to %s', (roll, expected) => {
    expect(pickWeightedRarity(weights, () => roll)).toBe(expected)
  })

  it('parses configurable relative weights', () => {
    expect(parseWorkerConfig('[rarity_weights]\nCommon=4\nUncommon=3\nRare=2\nEpic=1')).toEqual({
      rarityWeights: { Common: 4, Uncommon: 3, Rare: 2, Epic: 1 },
    })
  })

  it('associates each rarity with its requested color', () => {
    expect(Object.fromEntries(Object.entries(RARITY_COLORS).map(([rarity, color]) => [rarity, color.name]))).toEqual({
      Common: 'White',
      Uncommon: 'Green',
      Rare: 'Blue',
      Epic: 'Purple',
    })
  })
})
