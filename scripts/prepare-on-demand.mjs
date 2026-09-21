import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const compsDir = join(root, 'src/components')

const comps = readdirSync(compsDir)
  .filter((f) => statSync(join(compsDir, f)).isDirectory())
  .sort()

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

const PICKER_SUFFIX_COMPONENTS = new Set(['Select', 'TreeSelect', 'CascadeSelect'])
const STYLE_IMPORT_RE = /^import\s+['"]\.\/style['"]\s*;?\s*\r?\n/gm

function writeIfChanged(path, next) {
  if (existsSync(path) && readFileSync(path, 'utf8') === next) return false
  writeFileSync(path, next)
  return true
}

let styleWrites = 0
let indexWrites = 0

// Generate style.ts (idempotent: skip write when content is unchanged)
for (const c of comps) {
  const lines = [
    "import '../../theme/styles.css'",
    "import '../../styles/base.css'",
  ]
  if (PICKER_SUFFIX_COMPONENTS.has(c)) {
    lines.push(
      "import '../../shared/styles/control-suffix.css'",
      "import '../../shared/styles/control-affix-icon.css'",
    )
  }
  for (const dep of deps[c]) {
    if (existsSync(join(compsDir, dep, 'styles.css'))) {
      lines.push(`import '../${dep}/styles.css'`)
    }
  }
  if (existsSync(join(compsDir, c, 'styles.css'))) {
    lines.push("import './styles.css'")
  }
  if (writeIfChanged(join(compsDir, c, 'style.ts'), `${lines.join('\n')}\n`)) {
    styleWrites += 1
  }
}

// Ensure a single `import './style'` at the top of index.ts when style.ts exists
for (const c of comps) {
  const indexPath = join(compsDir, c, 'index.ts')
  const stylePath = join(compsDir, c, 'style.ts')
  if (!existsSync(indexPath)) continue

  let code = readFileSync(indexPath, 'utf8')
  const withoutStyleImports = code.replace(STYLE_IMPORT_RE, '')
  const next = existsSync(stylePath)
    ? `import './style'\n${withoutStyleImports}`
    : withoutStyleImports

  if (writeIfChanged(indexPath, next)) {
    indexWrites += 1
  }
}

console.log(
  `Prepared on-demand styles: ${comps.length} components` +
    ` (${styleWrites} style.ts, ${indexWrites} index.ts updated)`,
)
