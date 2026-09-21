import { createInterface } from 'node:readline'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readJson } from './fs-utils.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CATALOG_PATH = join(__dirname, '..', 'catalog', 'skills.json')

/**
 * @typedef {{
 *   id: string
 *   name: string
 *   description: string
 *   required?: boolean
 *   default?: boolean
 *   path: string
 * }} SkillEntry
 */

/**
 * @returns {{ skills: SkillEntry[] }}
 */
export function loadSkillsCatalog() {
  return readJson(CATALOG_PATH)
}

/**
 * @param {SkillEntry[]} skills
 */
export function defaultSkillIds(skills) {
  return skills.filter((s) => s.required || s.default).map((s) => s.id)
}

/**
 * @param {string | undefined} raw
 * @param {SkillEntry[]} skills
 * @returns {string[]}
 */
export function parseSkillsFlag(raw, skills) {
  if (raw == null || raw === '') return defaultSkillIds(skills)
  const known = new Map(skills.map((s) => [s.id, s]))
  if (raw.trim() === 'all') return skills.map((s) => s.id)

  const ids = raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  if (ids.length === 0) return defaultSkillIds(skills)

  const missing = ids.filter((id) => !known.has(id))
  if (missing.length) {
    throw new Error(
      `Unknown skill id(s): ${missing.join(', ')}. Available: ${skills.map((s) => s.id).join(', ')}, or all`,
    )
  }

  const selected = new Set(ids)
  for (const skill of skills) {
    if (skill.required) selected.add(skill.id)
  }
  return skills.map((s) => s.id).filter((id) => selected.has(id))
}

/**
 * @param {string[]} skillIds
 * @param {SkillEntry[]} skills
 * @returns {string[]}
 */
export function skillPathsForIds(skillIds, skills) {
  const byId = new Map(skills.map((s) => [s.id, s]))
  return skillIds.map((id) => {
    const entry = byId.get(id)
    if (!entry) throw new Error(`Unknown skill id: ${id}`)
    return entry.path
  })
}

/**
 * Build template include prefixes for the AI pack.
 * @param {string[]} skillIds
 * @param {SkillEntry[]} skills
 */
export function buildAiInclude(skillIds, skills) {
  return [
    'DESIGN.md',
    ...skillPathsForIds(skillIds, skills),
    '.cursor/rules',
    'scripts/check-raw-colors.mjs',
  ]
}

/**
 * Prompt for optional skills when stdin is a TTY.
 * Required skills are always included.
 * @param {SkillEntry[]} skills
 * @param {{ skipPrompt?: boolean }} [options]
 * @returns {Promise<string[]>}
 */
export async function resolveSkillSelection(skills, { skipPrompt = false } = {}) {
  const required = skills.filter((s) => s.required).map((s) => s.id)
  const optional = skills.filter((s) => !s.required)

  if (skipPrompt || optional.length === 0 || !process.stdin.isTTY) {
    return defaultSkillIds(skills)
  }

  console.log('Select optional Agent skills (in addition to required):')
  optional.forEach((skill, index) => {
    const mark = skill.default ? 'x' : ' '
    console.log(`  ${index + 1}. [${mark}] ${skill.id} — ${skill.description}`)
  })
  console.log('')
  console.log('Enter comma-separated numbers or ids (empty = defaults only).')
  console.log(`Required: ${required.join(', ') || '(none)'}`)

  const answer = await question('> ')
  const trimmed = answer.trim()
  if (!trimmed) return defaultSkillIds(skills)

  const selected = new Set(required)
  const tokens = trimmed.split(/[\s,]+/).filter(Boolean)
  for (const token of tokens) {
    const asIndex = Number(token)
    if (Number.isInteger(asIndex) && asIndex >= 1 && asIndex <= optional.length) {
      selected.add(optional[asIndex - 1].id)
      continue
    }
    if (token === 'all') {
      for (const skill of optional) selected.add(skill.id)
      continue
    }
    if (!skills.some((s) => s.id === token)) {
      throw new Error(`Unknown skill selection: ${token}`)
    }
    selected.add(token)
  }

  return skills.map((s) => s.id).filter((id) => selected.has(id))
}

/**
 * @param {string} prompt
 * @returns {Promise<string>}
 */
function question(prompt) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}
