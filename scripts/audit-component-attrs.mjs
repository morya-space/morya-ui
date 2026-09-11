/**
 * Audit hybrid attrs compliance under src/components.
 * Run: node scripts/audit-component-attrs.mjs
 */
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const ROOT = new URL('../src/components', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const INTERNAL = /(Nodes|NodeItem|TableRow|TableLoadingLine|Thumb|Addon)\.vue$/i
const LEAF_OK = new Set([
  'Avatar/Avatar.vue',
  'Badge/Badge.vue',
  'Button/Button.vue',
  'Chip/Chip.vue',
  'Divider/Divider.vue',
  'Icon/Icon.vue',
  'ProgressBar/ProgressBar.vue',
  'Tag/Tag.vue',
  'ToggleButton/ToggleButton.vue',
  'Tooltip/Tooltip.vue',
])

async function walk(dir, out = []) {
  for (const name of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, name.name)
    if (name.isDirectory()) await walk(path, out)
    else if (name.name.endsWith('.vue')) out.push(path)
  }
  return out
}

function rel(path) {
  return relative(ROOT, path).replace(/\\/g, '/')
}

const COMPOSABLE = /use(?:Root|Field|ControlRoot)Parts/
const INHERIT_FALSE = /inheritAttrs\s*:\s*false/
const BLIND_ATTRS = /v-bind="(?:attrs|\$attrs)"/

const files = (await walk(ROOT)).filter((f) => !INTERNAL.test(f))

const compliant = []
const leafOk = []
const mustFix = []
const blindBind = []

for (const file of files) {
  const r = rel(file)
  const src = await readFile(file, 'utf8')
  if (BLIND_ATTRS.test(src)) blindBind.push(r)
  if (LEAF_OK.has(r)) {
    leafOk.push(r)
    continue
  }
  const hasComposable = COMPOSABLE.test(src)
  const hasInheritFalse = INHERIT_FALSE.test(src)
  if (hasComposable && hasInheritFalse) compliant.push(r)
  else mustFix.push(r)
}

console.log('=== Morya UI — hybrid attrs audit ===\n')
console.log(`Total public .vue: ${files.length}`)
console.log(`Compliant (inheritAttrs:false + composable): ${compliant.length}`)
console.log(`Leaf OK (default inheritAttrs): ${leafOk.length}`)
console.log(`Must fix: ${mustFix.length}`)
if (blindBind.length) console.log(`Blind v-bind attrs: ${blindBind.length}`)

if (mustFix.length) {
  console.log('\n--- Must fix ---')
  for (const f of mustFix.sort()) console.log(`  ${f}`)
}

if (blindBind.length) {
  console.log('\n--- Blind v-bind ---')
  for (const f of blindBind.sort()) console.log(`  ${f}`)
}

process.exit(mustFix.length || blindBind.length ? 1 : 0)
