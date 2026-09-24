#!/usr/bin/env node
/**
 * Copy whitelisted paths from repo design-kit/ into packages/setup/template/.
 * Skill folders come from packages/setup/catalog/skills.json.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgRoot = resolve(__dirname, '..')
const repoRoot = resolve(pkgRoot, '../..')
const sourceRoot = join(repoRoot, 'design-kit')
const templateRoot = join(pkgRoot, 'template')
const catalogPath = join(pkgRoot, 'catalog', 'skills.json')

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'))
// Only first-party template skills are vendored; companions install via skills CLI at setup time.
const skillPaths = catalog.skills
  .filter((skill) => !skill.install || skill.install === 'template')
  .map((skill) => skill.path)

/** Relative paths under design-kit to publish for consumers. */
const INCLUDE = [
  'DESIGN.md',
  ...skillPaths,
  '.cursor/rules',
  'scripts/check-raw-colors.mjs',
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
