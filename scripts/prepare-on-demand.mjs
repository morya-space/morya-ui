import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const compsDir = join(root, 'src/components')

const comps = readdirSync(compsDir).filter((f) => statSync(join(compsDir, f)).isDirectory()).sort()

const re = /import\s[^'"]*from\s+['"]\.\.\/([A-Z][a-zA-Z]+)\//g

const deps = {}
for (const c of comps) {
  const files = readdirSync(join(compsDir, c))
  const set = new Set()
  for (const f of files) {
    if (!/\.(vue|ts)$/.test(f) || f === 'index.ts' || f === 'style.ts') continue
    const text = readFileSync(join(compsDir, c, f), 'utf8')
    let m
    while ((m = re.exec(text)) !== null) set.add(m[1])
  }
  deps[c] = [...set].sort()
}

// Generate style.ts
for (const c of comps) {
  const lines = [
    "import '../../theme/styles.css'",
    "import '../../styles/base.css'",
  ]
  for (const dep of deps[c]) {
    if (existsSync(join(compsDir, dep, 'styles.css'))) {
      lines.push(`import '../${dep}/styles.css'`)
    }
  }
  if (existsSync(join(compsDir, c, 'styles.css'))) {
    lines.push("import './styles.css'")
  }
  writeFileSync(join(compsDir, c, 'style.ts'), `${lines.join('\n')  }\n`)
}

// Prepend import './style' to index.ts if missing
for (const c of comps) {
  const indexPath = join(compsDir, c, 'index.ts')
  if (!existsSync(indexPath)) continue
  let code = readFileSync(indexPath, 'utf8')
  if (/^import\s+['"]\.\/style['"]\s*\n/.test(code)) continue
  code = `import './style'\n${  code.replace(/^import\s+['"]\.\/style['"]\s*\n/, '')}`
  writeFileSync(indexPath, code)
}

console.log(`Generated style.ts for ${comps.length} components and updated index.ts imports.`)
