/**
 * Remove boilerplate "## 样式与 attrs" / "## Styling & attrs" sections from component docs.
 * Keeps only components with non-obvious attrs placement documented in that section.
 * Run: node scripts/remove-generic-attrs-docs.mjs
 */
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../src/components', import.meta.url))

/** Components that keep a dedicated attrs section (non-default DOM target). */
const KEEP_SECTION = new Set(['Dialog', 'Checkbox', 'Select'])

const HEADING_ZH = '## 样式与 attrs'
const HEADING_EN = '## Styling & attrs'

function componentName(filePath) {
  const m = filePath.replace(/\\/g, '/').match(/components\/([^/]+)\/docs\//)
  return m?.[1] ?? ''
}

function removeAttrsSection(content, heading) {
  const re = new RegExp(`\\n${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n[\\s\\S]*?(?=\\n## |$)`)
  return content.replace(re, '')
}

async function walk(dir, out = []) {
  for (const name of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, name.name)
    if (name.isDirectory()) await walk(path, out)
    else if (name.name === 'index.md' || name.name === 'index.en.md') out.push(path)
  }
  return out
}

let n = 0
for (const file of await walk(ROOT)) {
  const name = componentName(file)
  if (!name || KEEP_SECTION.has(name)) continue

  const lang = file.endsWith('.en.md') ? 'en' : 'zh'
  const heading = lang === 'en' ? HEADING_EN : HEADING_ZH
  const src = await readFile(file, 'utf8')
  const next = removeAttrsSection(src, heading)
  if (next !== src) {
    await writeFile(file, next, 'utf8')
    n++
  }
}

console.log(`Removed generic attrs sections from ${n} doc files`)
console.log(`Kept attrs sections for: ${[...KEEP_SECTION].join(', ')}`)
