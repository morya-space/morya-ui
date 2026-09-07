#!/usr/bin/env node
/**
 * One-time migration: Wd/wd/--wd-* → Rd/rd/--rd-*
 * Usage: node scripts/rename-wd-to-rd.mjs [rootDir...]
 */
import { readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const roots = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [join(import.meta.dirname, '..')]

const IGNORE_DIRS = new Set(['node_modules', 'dist', 'coverage', '.git', '.agents'])
const EXT = new Set([
  '.ts', '.tsx', '.vue', '.md', '.mdc', '.mjs', '.js', '.json', '.css', '.html', '.svg', '.yml', '.yaml',
])

function shouldSkip(rel) {
  const parts = rel.split(/[/\\]/)
  return parts.some((p) => IGNORE_DIRS.has(p)) || rel.endsWith('pnpm-lock.yaml') || rel.endsWith('rename-wd-to-rd.mjs')
}

function transform(content) {
  let s = content
  s = s.replaceAll('--wd-', '--rd-')
  s = s.replaceAll('.wd-', '.rd-')
  s = s.replaceAll("'wd-", "'rd-")
  s = s.replaceAll('"wd-', '"rd-')
  s = s.replaceAll('`wd-', '`rd-')
  s = s.replaceAll('wd-markdown', 'rd-markdown')
  s = s.replaceAll('wd-keep-style', 'rd-keep-style')
  s = s.replaceAll('useWd', 'useRd')
  s = s.replaceAll('WD_', 'RD_')
  s = s.replaceAll('$wd', '$rd')
  s = s.replaceAll('wdComponents', 'rdComponents')
  s = s.replace(/\bWd([A-Z][A-Za-z0-9]*)/g, 'Rd$1')
  s = s.replace(/prefix\s*\?\?\s*['"]Wd['"]/g, "prefix ?? 'Rd'")
  s = s.replace(/prefix\s*=\s*['"]wd['"]/g, "prefix = 'rd'")
  s = s.replace(/Default:\s*`Wd`/g, 'Default: `Rd`')
  s = s.replace(/maps `Wd\*/g, 'maps `Rd*')
  s = s.replace(/"prefix":\s*"wd"/g, '"prefix": "rd"')
  s = s.replace(/Well Design/g, 'Roost Design')
  s = s.replace(/"name":\s*"wex-design-ui"/g, '"name": "roost-design-ui"')
  s = s.replace(/Wex Design contributors/g, 'Roost Design contributors')
  return s
}

function walk(dir, relBase, files) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name)
    const rel = relBase ? `${relBase}/${name}` : name
    if (shouldSkip(rel)) continue
    const st = statSync(abs)
    if (st.isDirectory()) walk(abs, rel, files)
    else if (EXT.has(name.slice(name.lastIndexOf('.')))) files.push({ abs, rel })
  }
}

let count = 0
for (const root of roots) {
  const files = []
  walk(root, '', files)
  for (const { abs, rel } of files) {
    const before = readFileSync(abs, 'utf8')
    const after = transform(before)
    if (after !== before) {
      writeFileSync(abs, after)
      count++
      if (count <= 5) console.log('updated', rel)
    }
  }
}

console.log(`Renamed ${count} files under ${roots.join(', ')}`)

// Rename useWdId.ts → useRdId.ts in each root that has it
for (const root of roots) {
  const oldPath = join(root, 'src/shared/useWdId.ts')
  const newPath = join(root, 'src/shared/useRdId.ts')
  try {
    statSync(oldPath)
    renameSync(oldPath, newPath)
    console.log('Renamed useWdId.ts → useRdId.ts in', root)
  } catch {
    // ignore
  }
}
