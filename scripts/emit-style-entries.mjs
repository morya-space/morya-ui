import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const src = join(root, 'src')

const componentFolders = readdirSync(join(src, 'components')).filter((name) =>
  statSync(join(src, 'components', name)).isDirectory(),
).sort()

const re = /import\s[^'"]*from\s+['"]\.\.\/([A-Z][a-zA-Z]+)\//g

const deps = {}
for (const c of componentFolders) {
  const files = readdirSync(join(src, 'components', c))
  const set = new Set()
  for (const f of files) {
    if (!/\.(vue|ts)$/.test(f) || f === 'index.ts' || f === 'style.ts') continue
    const text = readFileSync(join(src, 'components', c, f), 'utf8')
    let m
    while ((m = re.exec(text)) !== null) set.add(m[1])
  }
  deps[c] = [...set].sort()
}

function toSlug(folder) {
  return folder
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

const PICKER_SUFFIX_COMPONENTS = new Set(['Select', 'TreeSelect', 'CascadeSelect'])

const entries = componentFolders.map((folder) => {
  const slug = toSlug(folder)
  const sheets = [
    'theme/styles.css',
    'styles/base.css',
    ...(PICKER_SUFFIX_COMPONENTS.has(folder)
      ? [
          'shared/styles/control-suffix.css',
          'shared/styles/control-affix-icon.css',
        ]
      : []),
    ...deps[folder].flatMap((dep) => {
      const rel = `components/${dep}/styles.css`
      return existsSync(join(src, rel)) ? [rel] : []
    }),
    ...(existsSync(join(src, 'components', folder, 'styles.css'))
      ? [`components/${folder}/styles.css`]
      : []),
  ]
  return { slug, folder, sheets }
})

function copyCss(rel) {
  const from = join(src, rel)
  if (!existsSync(from)) return false
  const to = join(dist, rel)
  mkdirSync(dirname(to), { recursive: true })
  copyFileSync(from, to)
  return true
}

const copied = new Set()
for (const entry of entries) {
  for (const sheet of entry.sheets) {
    if (copied.has(sheet)) continue
    if (copyCss(sheet)) copied.add(sheet)
  }

  mkdirSync(join(dist, entry.slug), { recursive: true })
  const imports = entry.sheets.map((sheet) => `import '../${sheet}'`).join('\n')
  writeFileSync(join(dist, entry.slug, 'style.js'), `${imports}\n`)
  const bundled = entry.sheets
    .filter((sheet) => existsSync(join(src, sheet)))
    .map((sheet) => readFileSync(join(src, sheet), 'utf8'))
    .join('\n')
  writeFileSync(join(dist, entry.slug, 'style.css'), bundled)

  const indexPath = join(dist, entry.slug, 'index.js')
  let indexCode = readFileSync(indexPath, 'utf8').replace(/^import '\.\/style\.js'\r?\n/, '')
  if (!/import\s+['"]\.\/style\.js['"]/.test(indexCode)) {
    indexCode = `import './style.js'\n${indexCode}`
  }
  writeFileSync(indexPath, indexCode)
}

rmSync(join(dist, 'styles.js'), { force: true })
rmSync(join(dist, 'assets'), { recursive: true, force: true })

console.log(`Emitted style entries for ${entries.map((entry) => entry.slug).join(', ')}`)
