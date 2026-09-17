import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const pkgRoot = join(here, '..')
const repoRoot = join(pkgRoot, '../..')
const sourceDir = join(repoRoot, 'design-kit/docs/golden-pages')
const targetDir = join(pkgRoot, 'data/golden-pages')

if (!existsSync(sourceDir)) {
  console.warn(`Golden pages source missing: ${sourceDir}`)
  process.exit(0)
}

mkdirSync(targetDir, { recursive: true })
for (const file of readdirSync(sourceDir).filter((name) => name.endsWith('.vue'))) {
  copyFileSync(join(sourceDir, file), join(targetDir, file))
}

console.log(`Copied golden pages to ${targetDir}`)
