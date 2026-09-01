#!/usr/bin/env node
/**
 * Scan source files for raw color literals outside design-tokens/.
 * Usage: node scripts/check-raw-colors.mjs [dir...]
 * Exit 1 if violations found.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const roots = process.argv.slice(2).length ? process.argv.slice(2) : ['src']
const IGNORE_DIRS = new Set(['node_modules', 'dist', 'coverage', 'design-tokens', '.git'])
const EXT = new Set(['.vue', '.css', '.scss', '.ts', '.tsx', '.js', '.jsx'])

const HEX = /#[0-9a-fA-F]{3,8}\b/g
const RGB = /\brgb\s*\(/g
const HSL = /\bhsl\s*\(/g

/** Allow transparent, currentColor, inherit in CSS values */
const ALLOW_LINE = /var\s*\(\s*--wi-|color-mix\s*\(|transparent|currentColor|inherit|none/

const violations = []

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      if (IGNORE_DIRS.has(name)) continue
      walk(full)
      continue
    }
    const ext = path.extname(name)
    if (!EXT.has(ext)) continue
    if (full.replace(/\\/g, '/').includes('design-tokens/')) continue

    const text = readFileSync(full, 'utf8')
    const lines = text.split(/\r?\n/)
    lines.forEach((line, index) => {
      if (ALLOW_LINE.test(line)) return
      if (HEX.test(line) || RGB.test(line) || HSL.test(line)) {
        HEX.lastIndex = 0
        RGB.lastIndex = 0
        HSL.lastIndex = 0
        violations.push({ file: full, line: index + 1, text: line.trim() })
      }
    })
  }
}

for (const root of roots) {
  try {
    walk(path.resolve(root))
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') continue
    throw error
  }
}

if (violations.length) {
  console.error(`Found ${violations.length} raw color literal(s). Use --wi-* tokens instead:\n`)
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}`)
    console.error(`    ${v.text}\n`)
  }
  process.exit(1)
}

console.log('No raw color literals found.')
