/**
 * Fail if legacy `wk-` class names or keyframes remain under src/.
 * Run: node scripts/audit-wk-classes.mjs
 */
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const ROOT = new URL('../src', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const SKIP = /node_modules|dist|coverage/

async function walk(dir, out = []) {
  for (const name of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, name.name)
    if (SKIP.test(path)) continue
    if (name.isDirectory()) await walk(path, out)
    else if (/\.(vue|css|ts|tsx|js|mjs)$/.test(name.name)) out.push(path)
  }
  return out
}

const hits = []
for (const file of await walk(ROOT)) {
  const src = await readFile(file, 'utf8')
  if (/\bwk-/.test(src)) {
    hits.push(relative(ROOT, file).replace(/\\/g, '/'))
  }
}

console.log('=== wk- legacy class audit ===\n')
if (hits.length) {
  console.log(`Found wk- in ${hits.length} file(s):`)
  hits.forEach((f) => console.log(`  ${f}`))
  process.exit(1)
}

console.log('No wk- prefixes under src/')
process.exit(0)
