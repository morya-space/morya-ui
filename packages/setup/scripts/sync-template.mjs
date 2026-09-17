#!/usr/bin/env node
/**
 * Copy whitelisted paths from repo design-kit/ into packages/setup/template/.
 */
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgRoot = resolve(__dirname, '..')
const repoRoot = resolve(pkgRoot, '../..')
const sourceRoot = join(repoRoot, 'design-kit')
const templateRoot = join(pkgRoot, 'template')

/** Relative paths under design-kit to publish for consumers. */
const INCLUDE = [
  'DESIGN.md',
  '.agents/skills/morya-ui-pages',
  '.cursor/rules',
  'docs',
  'design-tokens',
  'scripts/check-raw-colors.mjs',
  'src/examples',
  'src/styles',
]

if (!existsSync(sourceRoot)) {
  console.error(`Missing design-kit at ${sourceRoot}`)
  process.exit(1)
}

rmSync(templateRoot, { recursive: true, force: true })
mkdirSync(templateRoot, { recursive: true })

for (const rel of INCLUDE) {
  const from = join(sourceRoot, rel)
  const to = join(templateRoot, rel)
  if (!existsSync(from)) {
    console.error(`Missing template source: ${from}`)
    process.exit(1)
  }
  mkdirSync(dirname(to), { recursive: true })
  cpSync(from, to, { recursive: true })
  console.log(`synced ${rel}`)
}

console.log(`Template ready at ${templateRoot}`)
