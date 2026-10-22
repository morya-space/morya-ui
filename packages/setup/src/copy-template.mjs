import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs'
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
 * Byte-for-byte comparison; false when the target is missing or unreadable.
 * @param {string} a
 * @param {string} b
 */
function sameFileContent(a, b) {
  try {
    return readFileSync(a).equals(readFileSync(b))
  } catch {
    return false
  }
}

/**
 * Copy template tree into target cwd.
 *
 * Template files are publisher-owned, so re-running setup upgrades them by
 * default: identical files are left untouched (`unchanged`), drifted ones are
 * overwritten (`updated`). Pass `keepLocal` to preserve locally edited files
 * instead (`kept-local`), or `force` to overwrite unconditionally.
 *
 * @param {string} templateRoot
 * @param {string} cwd
 * @param {{ force?: boolean, keepLocal?: boolean, dryRun?: boolean, include?: string[] }} [options]
 * @returns {{ copied: string[], updated: string[], unchanged: string[], keptLocal: string[], forced: string[] }}
 */
export function copyTemplate(templateRoot, cwd, { force = false, keepLocal = false, dryRun = false, include } = {}) {
  const copied = []
  const updated = []
  const unchanged = []
  const keptLocal = []
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

    if (!exists) {
      if (!dryRun) {
        mkdirSync(dirname(to), { recursive: true })
        cpSync(from, to)
      }
      copied.push(rel)
      continue
    }

    if (sameFileContent(from, to)) {
      unchanged.push(rel)
      continue
    }

    // File exists locally and has drifted from the template.
    if (keepLocal && !force) {
      keptLocal.push(rel)
      continue
    }

    if (!dryRun) {
      mkdirSync(dirname(to), { recursive: true })
      cpSync(from, to)
    }
    if (force) forced.push(rel)
    else updated.push(rel)
  }

  return { copied, updated, unchanged, keptLocal, forced }
}
