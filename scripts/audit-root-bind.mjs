/**
 * Find components with composable wired but rootAttrs not bound in template.
 */
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const ROOT = new URL('../src/components', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const INTERNAL = /(Nodes|NodeItem|TableRow|TableLoadingLine|Thumb|Addon)\.vue$/i

async function walk(dir, out = []) {
  for (const name of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, name.name)
    if (name.isDirectory()) await walk(path, out)
    else if (name.name.endsWith('.vue') && !INTERNAL.test(name.name)) out.push(path)
  }
  return out
}

const wrongRoot = []
const noBind = []

for (const file of await walk(ROOT)) {
  const rel = file.replace(/\\/g, '/').split('src/components/')[1]
  const src = await readFile(file, 'utf8')
  const hasComposable = /use(?:Root|Field|ControlRoot)Parts/.test(src)
  const hasInherit = /inheritAttrs\s*:\s*false/.test(src)
  const hasRootBind = /v-bind="rootAttrs"/.test(src)
  const hasControlOnly = /v-bind="controlAttrs"/.test(src) && !hasRootBind

  if (hasComposable && hasInherit && !hasRootBind && !hasControlOnly) {
    noBind.push(rel)
  }

  // Heuristic: rootAttrs on inner class patterns
  const innerPatterns = [
    /v-bind="rootAttrs"[^>]*class="m-splitter__panel"/,
    /v-bind="rootAttrs"[^>]*class="m-virtualscroller__spacer"/,
    /v-bind="rootAttrs"[^>]*class="m-carousel__main"/,
  ]
  const allowButtonRoot = /ScrollTop\/ScrollTop\.vue$/.test(rel)
  if (!allowButtonRoot && /v-bind="rootAttrs"[^>]*type="button"/.test(src)) {
    wrongRoot.push(rel)
  }
  if (innerPatterns.some((p) => p.test(src))) {
    wrongRoot.push(rel)
  }
}

console.log('=== rootAttrs template audit ===\n')
console.log(`Missing v-bind="rootAttrs" entirely: ${noBind.length}`)
noBind.forEach((f) => console.log(`  ${f}`))
console.log(`\nSuspicious inner binding: ${wrongRoot.length}`)
wrongRoot.forEach((f) => console.log(`  ${f}`))

process.exit(noBind.length || wrongRoot.length ? 1 : 0)
