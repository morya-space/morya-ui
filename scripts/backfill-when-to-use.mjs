#!/usr/bin/env node
/**
 * Insert a minimal "## 何时使用" / "## When to use" stub after the intro
 * paragraph for component docs that lack it. Uses frontmatter description.
 *
 * Usage:
 *   node scripts/backfill-when-to-use.mjs
 *   node scripts/backfill-when-to-use.mjs --dry-run
 *   node scripts/backfill-when-to-use.mjs --component Button
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const componentsDir = path.join(repoRoot, 'src/components')

const dryRun = process.argv.includes('--dry-run')
const componentArgIndex = process.argv.findIndex((a) => a === '--component' || a === '-c')
const only = componentArgIndex >= 0 ? process.argv[componentArgIndex + 1] : null

/**
 * @param {string} raw
 */
function parseDescription(raw) {
  const match = raw.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match?.[1]) return ''
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.startsWith('description:')) continue
    let value = line.slice('description:'.length).trim()
    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    return value.trim()
  }
  return ''
}

/**
 * @param {string} raw
 * @param {'zh' | 'en'} lang
 * @param {string} description
 */
function insertWhenSection(raw, lang, description) {
  const whenRe = lang === 'en' ? /^##\s+When to use\s*$/m : /^##\s+何时使用\s*$/m
  if (whenRe.test(raw)) return null

  const heading = lang === 'en' ? '## When to use' : '## 何时使用'
  const bullet = description
    ? `- ${description.replace(/\s+/g, ' ').replace(/\.$/, '')}`
    : lang === 'en'
      ? '- Use this component when the UI needs the behavior described above.'
      : '- 需要本页描述的交互能力时使用。'
  const block = `\n${heading}\n\n${bullet}\n`

  // After frontmatter + H1 + first paragraph(s), before first ## heading or ## Import/引入
  const fmEnd = raw.search(/\r?\n---\r?\n/)
  if (fmEnd < 0) return null
  const afterFm = raw.indexOf('\n', fmEnd + 1) // end of closing ---
  // Find first ## section heading after H1
  const body = raw.slice(afterFm + 1)
  const sectionMatch = body.match(/\n##\s+\S/)
  if (!sectionMatch || sectionMatch.index == null) return null
  const insertAt = afterFm + 1 + sectionMatch.index + 1 // position of '#'
  return `${raw.slice(0, insertAt)}${block}\n${raw.slice(insertAt)}`
}

let changed = 0
let skipped = 0

for (const name of readdirSync(componentsDir).sort()) {
  if (only && name !== only) continue
  const dir = path.join(componentsDir, name)
  if (!statSync(dir).isDirectory()) continue

  for (const [file, lang] of [
    ['docs/index.md', 'zh'],
    ['docs/index.en.md', 'en'],
  ]) {
    const full = path.join(dir, file)
    if (!existsSync(full)) continue
    const raw = readFileSync(full, 'utf8')
    const next = insertWhenSection(raw, /** @type {'zh'|'en'} */ (lang), parseDescription(raw))
    if (!next) {
      skipped += 1
      continue
    }
    changed += 1
    if (dryRun) {
      console.log(`[dry-run] would update ${name}/${file}`)
    } else {
      writeFileSync(full, next, 'utf8')
      console.log(`updated ${name}/${file}`)
    }
  }
}

console.log(`${dryRun ? 'Would update' : 'Updated'} ${changed} files; skipped ${skipped} (already present or missing).`)
