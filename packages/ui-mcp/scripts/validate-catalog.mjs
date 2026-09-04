import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const pkgRoot = join(here, '..')
const repoRoot = join(pkgRoot, '../..')
const catalogPath = join(pkgRoot, 'data/catalog.json')
const componentsDir = join(repoRoot, 'src/components')
const patternsPath = join(pkgRoot, 'src/patterns.ts')

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'))
const errors = []

function error(message) {
  errors.push(message)
}

const sourceComponents = new Set(
  readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => existsSync(join(componentsDir, entry.name, 'docs/index.md')) || existsSync(join(componentsDir, entry.name, 'docs/index.en.md')))
    .map((entry) => entry.name),
)
const catalogComponents = new Set(catalog.components.map((component) => component.id))

for (const id of sourceComponents) {
  if (!catalogComponents.has(id)) error(`Missing catalog component: ${id}`)
}
for (const id of catalogComponents) {
  if (!sourceComponents.has(id)) error(`Catalog component has no documented source directory: ${id}`)
}

const knownComponents = new Map(
  catalog.components.flatMap((component) => [
    [component.id, component],
    [component.name, component],
    [component.exportName, component],
  ]),
)

const patternComponentParents = {
  FormItem: 'Form',
  LayoutSider: 'Layout',
  LayoutHeader: 'Layout',
  LayoutContent: 'Layout',
  GridItem: 'Grid',
}

const patternsSource = readFileSync(patternsPath, 'utf8')
for (const match of patternsSource.matchAll(/component:\s*['"]([^'"]+)['"]/g)) {
  const name = match[1]
  const parentId = patternComponentParents[name]
  const component =
    knownComponents.get(name) ||
    knownComponents.get(`Wd${name}`) ||
    (parentId ? knownComponents.get(parentId) : undefined)
  if (!component) error(`Pattern references unknown component: ${name}`)
}

const allowedNativeProps = new Set([
  'class',
  'style',
  'id',
  'title',
  'role',
  'tabindex',
  'name',
  'value',
  'type',
  'disabled',
  'checked',
  'placeholder',
  'readonly',
  'required',
  'aria-label',
  'ariaLabel',
  'data-testid',
])

function kebab(value) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}

function examplePropNames(code) {
  const props = []
  let start = 0
  while (start < code.length) {
    const open = code.indexOf('<Wd', start)
    if (open === -1) break
    const nameMatch = code.slice(open + 3).match(/^[A-Z][A-Za-z0-9]*/)
    if (!nameMatch) {
      start = open + 3
      continue
    }
    let end = open + 3 + nameMatch[0].length
    let quote = ''
    while (end < code.length) {
      const character = code[end]
      if (quote) {
        if (character === quote && code[end - 1] !== '\\\\') quote = ''
      } else if (character === '"' || character === "'") {
        quote = character
      } else if (character === '>') {
        break
      }
      end += 1
    }
    const attrs = code.slice(open + 3 + nameMatch[0].length, end)
    for (const attr of attrs.matchAll(/(?:^|\s)([-:\\w@#]+)(?:\s*=|\s|$)/g)) {
      const name = attr[1]
      if (name.startsWith(':') || name.startsWith('@') || name.startsWith('#') || name.startsWith('v-')) continue
      props.push({ component: `Wd${nameMatch[0]}`, name })
    }
    start = end + 1
  }
  return props
}

for (const component of catalog.components) {
  const documentedProps = new Set(
    component.props.flatMap((prop) =>
      prop.name
        .split(/[\s`/|,]+/)
        .filter(Boolean)
        .flatMap((name) => [name, kebab(name)]),
    ),
  )
  for (const example of component.examples) {
    for (const usage of examplePropNames(example.code)) {
      if (usage.component !== component.exportName) continue
      if (allowedNativeProps.has(usage.name)) continue
      if (!documentedProps.has(usage.name)) {
        error(`Example ${component.id}/${example.id} uses undocumented prop: ${usage.component}.${usage.name}`)
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Catalog validation failed with ${errors.length} issue(s):`)
  for (const item of errors) console.error(`- ${item}`)
  process.exitCode = 1
} else {
  console.log(`Catalog validation passed (${catalog.components.length} components, ${catalog.guides.length} guides)`)
}
