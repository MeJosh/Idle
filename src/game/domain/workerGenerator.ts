import namesText from '../config/worker-names.txt?raw'
import workerConfigText from '../config/worker.cfg?raw'
import type { Worker, WorkerRarity } from './gameState'

export const WORKER_CANDIDATE_INTERVAL_MS = 60_000

export const WORKER_RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic'] as const

export const RARITY_COLORS: Record<WorkerRarity, { name: string; hex: string }> = {
  Common: { name: 'White', hex: '#ffffff' },
  Uncommon: { name: 'Green', hex: '#22c55e' },
  Rare: { name: 'Blue', hex: '#3b82f6' },
  Epic: { name: 'Purple', hex: '#a855f7' },
}

const ROLE_TEMPLATES = [
  { role: 'Scavenger', specialty: 'Finds useful parts in unlikely places.' },
  { role: 'Tinkerer', specialty: 'Keeps temperamental machines running.' },
  { role: 'Courier', specialty: 'Finishes delivery jobs ahead of schedule.' },
] as const

export interface WorkerGeneratorConfig {
  rarityWeights: Record<WorkerRarity, number>
}

const names = parseNameFile(namesText)
export const WORKER_GENERATOR_CONFIG = parseWorkerConfig(workerConfigText)

export function generateWorker(sequence: number, random: () => number = Math.random): Worker {
  const firstName = pick(names.firstNames, random)
  const lastName = pick(names.lastNames, random)
  const template = pick(ROLE_TEMPLATES, random)

  return {
    id: `candidate-${sequence}`,
    name: `${firstName} ${lastName}`,
    role: template.role,
    specialty: template.specialty,
    rarity: pickWeightedRarity(WORKER_GENERATOR_CONFIG.rarityWeights, random),
  }
}

export function pickWeightedRarity(
  weights: Record<WorkerRarity, number>,
  random: () => number = Math.random,
): WorkerRarity {
  const total = WORKER_RARITIES.reduce((sum, rarity) => sum + weights[rarity], 0)
  let roll = random() * total

  for (const rarity of WORKER_RARITIES) {
    roll -= weights[rarity]
    if (roll < 0) return rarity
  }

  return WORKER_RARITIES[WORKER_RARITIES.length - 1]
}

export function parseWorkerConfig(text: string): WorkerGeneratorConfig {
  const sections = parseSections(text)
  const entries = sections.rarity_weights ?? []
  const rawWeights = Object.fromEntries(
    entries.map((line) => {
      const [key, value] = line.split('=', 2).map((part) => part.trim())
      return [key, Number(value)]
    }),
  )

  const rarityWeights = Object.fromEntries(
    WORKER_RARITIES.map((rarity) => [rarity, rawWeights[rarity]]),
  ) as Record<WorkerRarity, number>

  if (WORKER_RARITIES.some((rarity) => !Number.isFinite(rarityWeights[rarity]) || rarityWeights[rarity] < 0)) {
    throw new Error('worker.cfg must define a non-negative weight for every worker rarity.')
  }
  if (WORKER_RARITIES.every((rarity) => rarityWeights[rarity] === 0)) {
    throw new Error('worker.cfg must give at least one worker rarity a positive weight.')
  }

  return { rarityWeights }
}

function parseNameFile(text: string): { firstNames: string[]; lastNames: string[] } {
  const sections = parseSections(text)
  const firstNames = sections.first_names ?? []
  const lastNames = sections.last_names ?? []

  if (firstNames.length === 0 || lastNames.length === 0) {
    throw new Error('worker-names.txt must contain first_names and last_names sections.')
  }

  return { firstNames, lastNames }
}

function parseSections(text: string): Record<string, string[]> {
  const sections: Record<string, string[]> = {}
  let currentSection: string | null = null

  for (const untrimmedLine of text.split(/\r?\n/)) {
    const line = untrimmedLine.trim()
    if (!line || line.startsWith('#') || line.startsWith(';')) continue

    const section = line.match(/^\[([^\]]+)\]$/)
    if (section) {
      currentSection = section[1]
      sections[currentSection] ??= []
    } else if (currentSection) {
      sections[currentSection].push(line)
    }
  }

  return sections
}

function pick<T>(values: readonly T[], random: () => number): T {
  return values[Math.min(Math.floor(random() * values.length), values.length - 1)]
}
