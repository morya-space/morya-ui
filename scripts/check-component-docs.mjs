#!/usr/bin/env node
/**
 * Machine-check component doc skeleton (Phase 4 discoverability).
 *
 * Hard requirements (fail CI):
 *   - docs/index.md exists
 *   - frontmatter `description` non-empty
 *   - at least one ```vue preview fence
 *   - Props or API section (heading or table header)
 *
 * Soft by default (warn):
 *   - "## 何时使用" / "## When to use"
 *   - optional docs/index.en.md with same hard checks when present
 *
 * Flags:
 *   --require-when     treat missing 何时使用 / When to use as hard fail
 *   --require-en       require docs/index.en.md for every component
 *   --json             print JSON summary to stdout
 *   --component Name   only check one folder name
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const componentsDir = path.join(repoRoot, 'src/components')

const opts = {
  requireWhen: false,
  requireEn: false,
  json: false,
  component: null,
}

const argv = process.argv.slice(2)
for (let i = 0; i < argv.length; i += 1) {
  const arg = argv[i]
  if (arg === '--require-when') opts.requireWhen = true
  else if (arg === '--require-en') opts.requireEn = true
  else if (arg === '--json') opts.json = true
  else if (arg === '--component' || arg === '-c') {
    i += 1
    opts.component = argv[i]
  } else if (arg.startsWith('--component=')) {
    opts.component = arg.slice('--component='.length)
  }
}

/**
 * @param {string} raw
 */
function parseFrontmatter(raw) {
  const normalized = raw.replace(/^\uFEFF/, '')
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match?.[1]) return {}
  /** @type {Record<string, string>} */
  const result = {}
  for (const line of match[1].split(/\r?\n/)) {
    const sep = line.indexOf(':')
    if (sep <= 0) continue
    const key = line.slice(0, sep).trim()
    let value = line.slice(sep + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (key) result[key] = value
  }
  return result
}

/**
 * @param {string} raw
 * @param {'zh' | 'en'} lang
 */
function analyzeDoc(raw, lang) {
  const fm = parseFrontmatter(raw)
  const description = (fm.description || '').trim()
  const hasPreview = /```vue\s+preview\b/i.test(raw)
  const hasProps =
    /^##\s+(Props|API)\b/m.test(raw)
    || /^\|\s*(参数|Prop|Props)\s*\|/m.test(raw)
  const whenHeading = lang === 'en' ? /^##\s+When to use\s*$/m : /^##\s+何时使用\s*$/m
  const hasWhen = whenHeading.test(raw)
  /** @type {string[]} */
  const hard = []
  /** @type {string[]} */
  const soft = []
  if (!description) hard.push('missing frontmatter description')
  if (!hasPreview) hard.push('missing ```vue preview')
  if (!hasProps) hard.push('missing Props/API section or table')
  if (!hasWhen) soft.push(lang === 'en' ? 'missing "## When to use"' : 'missing "## 何时使用"')
  return { description, hasPreview, hasProps, hasWhen, hard, soft }
}

/**
 * @returns {string[]}
 */
function listComponentDirs() {
  return readdirSync(componentsDir)
    .filter((name) => statSync(path.join(componentsDir, name)).isDirectory())
    .filter((name) => !opts.component || name === opts.component)
    .sort()
}

const results = []
let hardFailCount = 0
let softWarnCount = 0

for (const name of listComponentDirs()) {
  const zhPath = path.join(componentsDir, name, 'docs/index.md')
  const enPath = path.join(componentsDir, name, 'docs/index.en.md')
  /** @type {{ name: string, hard: string[], soft: string[] }} */
  const entry = { name, hard: [], soft: [] }

  if (!existsSync(zhPath)) {
    entry.hard.push('missing docs/index.md')
  } else {
    const zh = analyzeDoc(readFileSync(zhPath, 'utf8'), 'zh')
    entry.hard.push(...zh.hard.map((m) => `zh: ${m}`))
    entry.soft.push(...zh.soft.map((m) => `zh: ${m}`))
    if (opts.requireWhen && !zh.hasWhen) {
      entry.hard.push('zh: missing "## 何时使用" (--require-when)')
    }
  }

  if (opts.requireEn && !existsSync(enPath)) {
    entry.hard.push('missing docs/index.en.md (--require-en)')
  } else if (existsSync(enPath)) {
    const en = analyzeDoc(readFileSync(enPath, 'utf8'), 'en')
    entry.hard.push(...en.hard.map((m) => `en: ${m}`))
    entry.soft.push(...en.soft.map((m) => `en: ${m}`))
    if (opts.requireWhen && !en.hasWhen) {
      entry.hard.push('en: missing "## When to use" (--require-when)')
    }
  }

  // Dedupe hard messages if require-when duplicated soft→hard
  entry.hard = [...new Set(entry.hard)]
  entry.soft = entry.soft.filter((msg) => {
    if (!opts.requireWhen) return true
    return !msg.includes('何时使用') && !msg.includes('When to use')
  })

  if (entry.hard.length) hardFailCount += 1
  if (entry.soft.length) softWarnCount += 1
  results.push(entry)
}

if (opts.json) {
  console.log(JSON.stringify({
    hardFailCount,
    softWarnCount,
    requireWhen: opts.requireWhen,
    requireEn: opts.requireEn,
    results: results.filter((r) => r.hard.length || r.soft.length),
  }, null, 2))
} else {
  const hardOnes = results.filter((r) => r.hard.length)
  const softOnes = results.filter((r) => r.soft.length)
  console.log(`check-component-docs: ${results.length} components`)
  console.log(`  hard fails: ${hardFailCount}`)
  console.log(`  soft warns: ${softWarnCount}${opts.requireWhen ? ' (when-to-use promoted to hard)' : ''}`)

  if (hardOnes.length) {
    console.log('\nHard failures:')
    for (const r of hardOnes) {
      console.log(`  - ${r.name}`)
      for (const m of r.hard) console.log(`      ${m}`)
    }
  }

  if (softOnes.length) {
    const sample = softOnes.slice(0, 12)
    console.log(`\nSoft warnings (showing ${sample.length}/${softOnes.length}):`)
    for (const r of sample) {
      console.log(`  - ${r.name}: ${r.soft.join('; ')}`)
    }
    if (softOnes.length > sample.length) {
      console.log(`  … +${softOnes.length - sample.length} more (run with --json for full list)`)
    }
  }

  if (!hardOnes.length && !softOnes.length) {
    console.log('All checked docs look good.')
  }
}

if (hardFailCount > 0) process.exitCode = 1
