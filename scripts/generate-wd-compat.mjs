#!/usr/bin/env node
/** Generate deprecated --wd-* CSS aliases for migration. */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const stylesPath = join(root, 'src/theme/styles.css')
const css = readFileSync(stylesPath, 'utf8')
const tokens = [...css.matchAll(/(?<![\w-])(--rd-[\w-]+)\s*:/g)].map((m) => m[1])
const unique = [...new Set(tokens)].sort()

const aliasLines = unique.map((rd) => `  --wd-${rd.slice(5)}: var(${rd});`).join('\n')
const cssOut = `/* @deprecated Use --rd-* tokens. Removed in a future major. */\n:root {\n${aliasLines}\n}\n`
writeFileSync(join(root, 'src/theme/wd-compat.css'), cssOut)

const compsDir = join(root, 'src/components')
const folders = readdirSync(compsDir).filter((f) => statSync(join(compsDir, f)).isDirectory()).sort()
const exportRe = /export\s+\{\s*default\s+as\s+(Rd[A-Za-z0-9]+)/g
const lines = []
for (const folder of folders) {
  const indexPath = join(compsDir, folder, 'index.ts')
  const text = readFileSync(indexPath, 'utf8')
  let match
  while ((match = exportRe.exec(text)) !== null) {
    const rd = match[1]
    const wd = `Wd${rd.slice(2)}`
    lines.push(`export { ${rd} as ${wd} } from '../components/${folder}/index'`)
  }
}

const tsOut = `/** @deprecated Use Rd* exports. Removed in a future major. */\n${lines.join('\n')}\n`
writeFileSync(join(root, 'src/compat/wd-exports.ts'), tsOut)

console.log(`Generated ${unique.length} CSS aliases and ${lines.length} component re-exports`)
