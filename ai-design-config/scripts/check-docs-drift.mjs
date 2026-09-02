#!/usr/bin/env node
/**
 * Docs <-> code drift checker.
 *
 * For each component directory under src/components, compares the Props / Emits
 * documented in `<Name>/docs/index.md` against the `<Name>Props` / `<Name>Emits`
 * interfaces declared in `<Name>/types.ts`.
 *
 * Usage:
 *   node ai-design-config/scripts/check-docs-drift.mjs [--report <path>] [--no-fail]
 *
 * Exit code is 1 when drift is found (unless --no-fail). Components without a
 * docs.md or without a parseable types.ts interface are reported as SKIP and
 * never fail the check.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const componentsDir = join(root, 'src/components')

const args = process.argv.slice(2)
const reportIndex = args.indexOf('--report')
const reportPath = reportIndex !== -1 ? args[reportIndex + 1] : undefined
const noFail = args.includes('--no-fail')

function toKebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/** Extract member names declared at one indent level inside `export interface <name> { ... }`. */
function parseInterfaceMembers(source, interfaceName) {
  const re = new RegExp(`export\\s+interface\\s+${interfaceName}(?:\\s+extends\\s+[^{]+)?\\s*\\{([\\s\\S]*?)\\n\\}`, 'm')
  const match = re.exec(source)
  if (!match) return null
  const names = new Set()
  for (const line of match[1].split('\n')) {
    const propMatch = /^ {2}['"]?([\w-]+)['"]?\??\s*:/.exec(line)
    if (propMatch) names.add(propMatch[1])
  }
  return names
}

/** Extract event names from `(event: 'name', ...)` call signatures of an emits interface. */
function parseEmitsMembers(source, interfaceName) {
  const re = new RegExp(`export\\s+(?:interface|type)\\s+${interfaceName}[^{=]*[={]\\s*([\\s\\S]*?)\\n\\}`, 'm')
  const match = re.exec(source)
  if (!match) return null
  const names = new Set()
  for (const eventMatch of match[1].matchAll(/\(\s*(?:\w+\s*:\s*)?['"]([^'"]+)['"]/g)) {
    names.add(eventMatch[1])
  }
  return names
}

/** Extract first-column backtick names from markdown tables under a heading. */
function parseDocTable(markdown, headingPattern) {
  const headingRe = new RegExp(`^#{2,4}\\s*.*(?:${headingPattern}).*$`, 'im')
  const heading = headingRe.exec(markdown)
  if (!heading) return null
  const rest = markdown.slice(heading.index + heading[0].length)
  const nextHeading = /^#{2,4}\s/m.exec(rest)
  const section = nextHeading ? rest.slice(0, nextHeading.index) : rest
  const names = new Set()
  for (const line of section.split('\n')) {
    const cellMatch = /^\s*\|\s*`([^`]+)`/.exec(line)
    if (cellMatch) names.add(cellMatch[1].trim())
  }
  return names
}

const entries = readdirSync(componentsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

const results = []
for (const name of entries) {
  const dir = join(componentsDir, name)
  const docsFile = join(dir, 'docs', 'index.md')
  const typesFile = join(dir, 'types.ts')
  if (!existsSync(docsFile) || !existsSync(typesFile)) {
    results.push({ name, skipped: true, reason: !existsSync(docsFile) ? 'no docs/index.md' : 'no types.ts' })
    continue
  }
  const docs = readFileSync(docsFile, 'utf8')
  const types = readFileSync(typesFile, 'utf8')

  const codeProps = parseInterfaceMembers(types, `${name}Props`)
  const codeEmits = parseEmitsMembers(types, `${name}Emits`)
  const docProps = parseDocTable(docs, 'Props|属性')
  const docEmits = parseDocTable(docs, 'Emits|Events|事件')

  if (!codeProps && !codeEmits) {
    results.push({ name, skipped: true, reason: 'no parseable interfaces' })
    continue
  }

  const drift = []
  if (codeProps && docProps) {
    const codeKebab = new Set([...codeProps].map(toKebab))
    const docKebab = new Set([...docProps].map(toKebab))
    const undocumented = [...codeKebab].filter((p) => !docKebab.has(p))
    const stale = [...docKebab].filter((p) => !codeKebab.has(p))
    if (undocumented.length) drift.push({ kind: 'props undocumented', names: undocumented })
    if (stale.length) drift.push({ kind: 'props stale (docs only)', names: stale })
  }
  if (codeEmits && docEmits) {
    // Docs typically write listener form (kebab), code emits camelCase; compare normalized.
    const codeKebab = new Set([...codeEmits].map(toKebab))
    const docKebab = new Set([...docEmits].map(toKebab))
    const undocumented = [...codeKebab].filter((e) => !docKebab.has(e))
    const stale = [...docKebab].filter((e) => !codeKebab.has(e))
    if (undocumented.length) drift.push({ kind: 'emits undocumented', names: undocumented })
    if (stale.length) drift.push({ kind: 'emits stale (docs only)', names: stale })
  }
  results.push({ name, skipped: false, drift })
}

const drifted = results.filter((r) => !r.skipped && r.drift.length > 0)
const skipped = results.filter((r) => r.skipped)

const lines = ['# Docs <-> Code Drift Report', '']
lines.push(`Checked ${results.length} components: ${drifted.length} drifted, ${skipped.length} skipped.`)
lines.push('')
if (drifted.length) {
  lines.push('## Drift')
  lines.push('')
  for (const r of drifted) {
    lines.push(`### ${r.name}`)
    for (const d of r.drift) lines.push(`- ${d.kind}: ${d.names.join(', ')}`)
    lines.push('')
  }
}
if (skipped.length) {
  lines.push('## Skipped')
  lines.push('')
  for (const r of skipped) lines.push(`- ${r.name}: ${r.reason}`)
  lines.push('')
}

const output = lines.join('\n')
console.log(output)

if (reportPath) {
  const target = reportPath.startsWith('/') ? reportPath : join(root, reportPath)
  writeFileSync(target, output)
  console.log(`Report written to ${target}`)
}

if (drifted.length && !noFail) process.exit(1)
