#!/usr/bin/env node
/**
 * Scan CSS files for var(--wd-*) references that are never defined.
 * Definitions are collected from the same scan roots (theme/styles.css,
 * styles/base.css, component styles.css); a token defined in any scanned
 * file counts as defined, so component-local tokens are not reported.
 * Tokens assigned at runtime via inline-style bindings in .vue/.ts files
 * (e.g. { '--wd-button-color': props.color }) also count as defined.
 * Usage: node scripts/check-undefined-tokens.mjs [dir...]
 * Exit 1 if violations found.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const roots = process.argv.slice(2).length ? process.argv.slice(2) : ['src']
const IGNORE_DIRS = new Set(['node_modules', 'dist', 'coverage', '.git'])
const CSS_EXT = new Set(['.css'])
const RUNTIME_EXT = new Set(['.vue', '.ts', '.tsx'])

const COMMENT = /\/\*[\s\S]*?\*\//g
const REFERENCE = /var\(\s*(--wd-[\w-]+)/g
const DEFINITION = /(?<![\w-])(--wd-[\w-]+)\s*:/g
const RUNTIME_PROVIDED = /['"](--wd-[\w-]+)['"]\s*:/g

const defined = new Set()
const files = []
const runtimeFiles = []

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
    if (CSS_EXT.has(ext)) files.push(full)
    else if (RUNTIME_EXT.has(ext)) runtimeFiles.push(full)
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

const contents = files.map((file) => ({
  file,
  text: readFileSync(file, 'utf8').replace(COMMENT, ''),
}))

for (const { text } of contents) {
  for (const match of text.matchAll(DEFINITION)) {
    defined.add(match[1])
  }
}

for (const file of runtimeFiles) {
  const text = readFileSync(file, 'utf8')
  for (const match of text.matchAll(RUNTIME_PROVIDED)) {
    defined.add(match[1])
  }
}

const violations = []

for (const { file, text } of contents) {
  const lines = text.split(/\r?\n/)
  lines.forEach((line, index) => {
    REFERENCE.lastIndex = 0
    for (const match of line.matchAll(REFERENCE)) {
      if (!defined.has(match[1])) {
        violations.push({ file, line: index + 1, name: match[1], text: line.trim() })
      }
    }
  })
}

if (violations.length) {
  console.error(`Found ${violations.length} reference(s) to undefined --wd-* token(s):\n`)
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  ${v.name}`)
    console.error(`    ${v.text}\n`)
  }
  process.exit(1)
}

console.log(`No undefined --wd-* token references found (${defined.size} tokens defined).`)
