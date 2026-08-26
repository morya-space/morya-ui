import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = 'src/components'
const comps = readdirSync(root).filter((f) => statSync(join(root, f)).isDirectory()).sort()
const re = /import\s+(?:type\s+)?\{?[^'"]*\}?\s*from\s+['"]\.\.\/([A-Z][a-zA-Z]+)\//g

const deps = {}
for (const c of comps) {
  const files = readdirSync(join(root, c))
  const set = new Set()
  for (const f of files) {
    if (!/\.(vue|ts)$/.test(f) || f === 'index.ts') continue
    const text = readFileSync(join(root, c, f), 'utf8')
    let m
    while ((m = re.exec(text)) !== null) set.add(m[1])
  }
  deps[c] = [...set].sort()
}

for (const c of comps) {
  console.log(c + ':' + (deps[c].length ? ' ' + deps[c].join(', ') : ''))
}
