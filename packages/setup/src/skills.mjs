import { execSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  rmSync,
  symlinkSync,
} from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'
import { ensureDir, readJson } from './fs-utils.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CATALOG_PATH = join(__dirname, '..', 'catalog', 'skills.json')

/** Canonical project skills root shared by Cursor / Zed / GitHub Copilot. */
export const CANONICAL_SKILLS_DIR = '.agents/skills'

/**
 * Default skills CLI agents for consumer projects.
 * VS Code Copilot uses `github-copilot` (reads `.agents/skills`).
 */
export const DEFAULT_SKILL_AGENTS = [
  'cursor',
  'github-copilot',
  'zed',
  'claude-code',
  'windsurf',
]

/**
 * Project-relative skills directories for agents that do **not** share
 * `.agents/skills`. Agents that already use the canonical dir are omitted.
 *
 * @type {Record<string, string[]>}
 */
export const EXTRA_AGENT_SKILL_DIRS = {
  'claude-code': ['.claude/skills'],
  windsurf: ['.windsurf/skills'],
  // Copilot also discovers `.github/skills`; keep a link for clients that prefer it.
  'github-copilot': ['.github/skills'],
}

export const KNOWN_SKILL_AGENTS = [
  ...new Set([...DEFAULT_SKILL_AGENTS, ...Object.keys(EXTRA_AGENT_SKILL_DIRS)]),
]

/**
 * @typedef {{
 *   id: string
 *   name: string
 *   description: string
 *   required?: boolean
 *   default?: boolean
 *   install?: 'template' | 'skills-cli'
 *   source?: string
 *   skill?: string
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
 * @param {SkillEntry} skill
 */
export function isTemplateSkill(skill) {
  return !skill.install || skill.install === 'template'
}

/**
 * @param {SkillEntry} skill
 */
export function isSkillsCliSkill(skill) {
  return skill.install === 'skills-cli'
}

/**
 * @param {SkillEntry[]} skills
 */
export function defaultSkillIds(skills) {
  return skills.filter((s) => s.required || s.default).map((s) => s.id)
}

/**
 * @param {string | undefined} raw
 * @returns {string[] | '*'}
 */
export function parseAgentsFlag(raw) {
  if (raw == null || raw.trim() === '') return [...DEFAULT_SKILL_AGENTS]
  if (raw.trim() === 'all' || raw.trim() === '*') return '*'

  const ids = raw
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)

  if (!ids.length) return [...DEFAULT_SKILL_AGENTS]
  if (ids.includes('*') || ids.includes('all')) return '*'

  const unknown = ids.filter((id) => !KNOWN_SKILL_AGENTS.includes(id))
  if (unknown.length) {
    throw new Error(
      `Unknown skill agent id(s): ${unknown.join(', ')}. Available: ${KNOWN_SKILL_AGENTS.join(', ')}, or all`,
    )
  }

  return [...new Set(ids)]
}

/**
 * Resolve concrete agent names for CLI / sync (expands `*`).
 * @param {string[] | '*'} agents
 * @returns {string[]}
 */
export function resolveSkillAgents(agents) {
  if (agents === '*') return [...DEFAULT_SKILL_AGENTS]
  if (!Array.isArray(agents) || !agents.length) return [...DEFAULT_SKILL_AGENTS]
  return [...new Set(agents)]
}

/**
 * Build `-a` flags for the skills CLI.
 * @param {string[] | '*'} agents
 */
export function skillAgentCliFlags(agents) {
  if (agents === '*') return "-a '*'"
  const list = resolveSkillAgents(agents)
  return list.map((name) => `-a ${name}`).join(' ')
}

/**
 * Extra project skill dirs to mirror for the selected agents.
 * @param {string[] | '*'} agents
 * @returns {string[]}
 */
export function extraSkillDirsForAgents(agents) {
  const list = agents === '*' ? [...DEFAULT_SKILL_AGENTS] : resolveSkillAgents(agents)
  /** @type {string[]} */
  const dirs = []
  for (const agent of list) {
    const extras = EXTRA_AGENT_SKILL_DIRS[agent]
    if (!extras) continue
    for (const dir of extras) {
      if (!dirs.includes(dir)) dirs.push(dir)
    }
  }
  return dirs
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
 * Template-relative paths for skills that ship inside the package template.
 * @param {string[]} skillIds
 * @param {SkillEntry[]} skills
 * @returns {string[]}
 */
export function skillPathsForIds(skillIds, skills) {
  const byId = new Map(skills.map((s) => [s.id, s]))
  return skillIds.flatMap((id) => {
    const entry = byId.get(id)
    if (!entry) throw new Error(`Unknown skill id: ${id}`)
    if (!isTemplateSkill(entry)) return []
    return [entry.path]
  })
}

/**
 * Build template include prefixes for the AI pack (first-party files only).
 * @param {string[]} skillIds
 * @param {SkillEntry[]} skills
 */
export function buildAiInclude(skillIds, skills) {
  return [
    'DESIGN.md',
    'AGENTS.md',
    ...skillPathsForIds(skillIds, skills),
    '.cursor/rules',
    'scripts/check-raw-colors.mjs',
  ]
}

/**
 * Folder names under `.agents/skills` for the selected skill ids.
 * @param {string[]} skillIds
 * @param {SkillEntry[]} skills
 * @returns {string[]}
 */
export function skillFolderNames(skillIds, skills) {
  const byId = new Map(skills.map((s) => [s.id, s]))
  return skillIds.map((id) => {
    const entry = byId.get(id)
    if (!entry) throw new Error(`Unknown skill id: ${id}`)
    return entry.skill || entry.id
  })
}

/**
 * Install selected companion skills via the skills CLI (always latest from source).
 * @param {string} cwd
 * @param {string[]} skillIds
 * @param {SkillEntry[]} skills
 * @param {{ dryRun?: boolean, agents?: string[] | '*' }} [options]
 * @returns {{ installed: string[], commands: string[], agents: string[] | '*', dryRun?: boolean, skipped?: boolean }}
 */
export function installSkillsCli(
  cwd,
  skillIds,
  skills,
  { dryRun = false, agents = DEFAULT_SKILL_AGENTS } = {},
) {
  const selected = skills.filter((s) => skillIds.includes(s.id) && isSkillsCliSkill(s))
  if (!selected.length) {
    return { installed: [], commands: [], agents, skipped: true }
  }

  for (const entry of selected) {
    if (!entry.source) {
      throw new Error(`Skill "${entry.id}" is marked skills-cli but has no source`)
    }
  }

  /** @type {Map<string, string[]>} */
  const bySource = new Map()
  for (const entry of selected) {
    const name = entry.skill || entry.id
    const list = bySource.get(entry.source) || []
    list.push(name)
    bySource.set(entry.source, list)
  }

  const agentFlags = skillAgentCliFlags(agents)
  const commands = []
  for (const [source, names] of bySource) {
    const skillFlags = names.map((name) => `-s ${name}`).join(' ')
    commands.push(`npx -y skills add ${source} ${skillFlags} ${agentFlags} -y`)
  }

  if (dryRun) {
    return { installed: selected.map((s) => s.id), commands, agents, dryRun: true }
  }

  console.log('Companion skills (latest via skills CLI):')
  for (const command of commands) {
    console.log(`  $ ${command}`)
    execSync(command, { cwd, stdio: 'inherit', shell: true })
  }

  return { installed: selected.map((s) => s.id), commands, agents }
}

/**
 * Link (or copy) canonical `.agents/skills/<name>` into agent-specific dirs.
 * @param {string} cwd
 * @param {string[]} skillNames folder names under `.agents/skills`
 * @param {{ force?: boolean, dryRun?: boolean, agents?: string[] | '*' }} [options]
 * @returns {{ results: Array<{ skill: string, dir: string, action: string }>, dryRun?: boolean, skipped?: boolean }}
 */
export function syncProjectSkillsToAgents(
  cwd,
  skillNames,
  { force = false, dryRun = false, agents = DEFAULT_SKILL_AGENTS } = {},
) {
  const names = [...new Set(skillNames.filter(Boolean))]
  const targetDirs = extraSkillDirsForAgents(agents)

  if (!names.length || !targetDirs.length) {
    return { results: [], skipped: true, dryRun }
  }

  /** @type {Array<{ skill: string, dir: string, action: string }>} */
  const results = []

  for (const dir of targetDirs) {
    for (const name of names) {
      const source = join(cwd, CANONICAL_SKILLS_DIR, name)
      const dest = join(cwd, dir, name)

      if (!existsSync(source)) {
        results.push({ skill: name, dir, action: 'missing-source' })
        continue
      }

      if (existsSync(dest) || isSymlink(dest)) {
        if (!force) {
          results.push({ skill: name, dir, action: 'skipped' })
          continue
        }
        if (!dryRun) {
          rmSync(dest, { recursive: true, force: true })
        }
      }

      if (dryRun) {
        results.push({ skill: name, dir, action: 'linked' })
        continue
      }

      ensureDir(join(cwd, dir))
      const action = linkOrCopySkill(source, dest)
      results.push({ skill: name, dir, action })
    }
  }

  return { results, dryRun }
}

/**
 * @param {string} path
 */
function isSymlink(path) {
  try {
    return lstatSync(path).isSymbolicLink()
  } catch {
    return false
  }
}

/**
 * Prefer symlink; fall back to recursive copy (e.g. Windows without privilege).
 * @param {string} source absolute
 * @param {string} dest absolute
 * @returns {'linked' | 'copied'}
 */
function linkOrCopySkill(source, dest) {
  mkdirSync(dirname(dest), { recursive: true })
  // Windows junctions need an absolute target; POSIX prefers a relative link.
  const rel = relative(dirname(dest), source) || '.'
  try {
    if (process.platform === 'win32') {
      symlinkSync(source, dest, 'junction')
    } else {
      symlinkSync(rel, dest, 'dir')
    }
    return 'linked'
  } catch {
    try {
      symlinkSync(rel, dest, 'dir')
      return 'linked'
    } catch {
      cpSync(source, dest, { recursive: true })
      return 'copied'
    }
  }
}

/**
 * Discover skill folder names already present under `.agents/skills`.
 * @param {string} cwd
 * @returns {string[]}
 */
export function listCanonicalSkillFolders(cwd) {
  const root = join(cwd, CANONICAL_SKILLS_DIR)
  if (!existsSync(root)) return []
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() || entry.isSymbolicLink())
    .filter((entry) => existsSync(join(root, entry.name, 'SKILL.md')))
    .map((entry) => entry.name)
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
    const via = isSkillsCliSkill(skill) ? ' [latest via skills CLI]' : ''
    console.log(`  ${index + 1}. [${mark}] ${skill.id} — ${skill.description}${via}`)
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
