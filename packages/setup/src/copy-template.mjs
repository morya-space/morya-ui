import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'

/**
 * Recursively list files under dir (relative to dir).
 * @param {string} dir
 * @returns {string[]}
 */
function listFiles(dir) {
  const out = []
  function walk(current) {
    for (const name of readdirSync(current)) {
      const full = join(current, name)
      const st = statSync(full)
      if (st.isDirectory()) walk(full)
      else out.push(relative(dir, full))
    }
  }
  walk(dir)
  return out
}

/**
 * @param {string} rel
 * @param {string[] | undefined} include
 */
function matchesInclude(rel, include) {
  if (!include || include.length === 0) return true
  const norm = rel.replace(/\\/g, '/')
  return include.some((prefix) => {
    const p = prefix.replace(/\\/g, '/')
    return norm === p || norm.startsWith(`${p}/`)
  })
}

/**
 * Copy template tree into target cwd.
 * @param {string} templateRoot
 * @param {string} cwd
 * @param {{ force?: boolean, dryRun?: boolean, include?: string[] }} [options]
 * @returns {{ copied: string[], skipped: string[], forced: string[] }}
 */
export function copyTemplate(templateRoot, cwd, { force = false, dryRun = false, include } = {}) {
  const copied = []
  const skipped = []
  const forced = []

  if (!existsSync(templateRoot)) {
    throw new Error(
      `Template missing at ${templateRoot}. Run sync-template / build before publishing.`,
    )
  }

  const files = listFiles(templateRoot).filter((rel) => matchesInclude(rel, include))
  for (const rel of files) {
    const from = join(templateRoot, rel)
    const to = join(cwd, rel)
    const exists = existsSync(to)

    if (exists && !force) {
      skipped.push(rel)
      continue
    }

    if (dryRun) {
      if (exists) forced.push(rel)
      else copied.push(rel)
      continue
    }

    mkdirSync(dirname(to), { recursive: true })
    cpSync(from, to)
    if (exists) forced.push(rel)
    else copied.push(rel)
  }

  return { copied, skipped, forced }
}
