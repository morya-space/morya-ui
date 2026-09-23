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
  LayoutFooter: 'Layout',
  GridItem: 'Grid',
  PageContent: 'Page',
  PageFilters: 'Page',
  PageToolbar: 'Page',
  PageHeader: 'Page',
  PageSection: 'Page',
  PageStat: 'Page',
  PagePlaceholder: 'Page',
}

const patternsSource = readFileSync(patternsPath, 'utf8')
for (const match of patternsSource.matchAll(/component:\s*['"]([^'"]+)['"]/g)) {
  const name = match[1]
  const parentId = patternComponentParents[name]
  const component =
    knownComponents.get(name) ||
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
    const open = code.indexOf('<M', start)
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
      props.push({ component: `M${nameMatch[0]}`, name })
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

// —— Source ↔ catalog API drift ——
// The catalog is parsed from docs tables, so docs can silently drift from the
// real API. Extract Props/Emits/Slots/Expose from each component's source and
// fail when something public is undocumented.

function readTextSafe(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : ''
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^[ \t]*\/\/.*$/gm, '')
}

function extractBracedBlock(source, openBraceIndex) {
  let depth = 0
  for (let i = openBraceIndex; i < source.length; i++) {
    if (source[i] === '{') depth++
    else if (source[i] === '}') {
      depth--
      if (depth === 0) return source.slice(openBraceIndex + 1, i)
    }
  }
  return ''
}

// Keys declared directly at the interface/object top level. Inherited members
// (`extends …`) are intentionally out of scope — docs may list them, source
// extraction simply never sees them, so they can only be under-reported here.
function topLevelKeys(block) {
  const keys = []
  let depth = 0
  for (const line of block.split('\n')) {
    if (depth === 0) {
      const match = line.match(/^\s*(?:readonly\s+)?['"]?([\w-]+)['"]?\s*\??\s*:/)
      if (match) keys.push(match[1])
    }
    for (const ch of line) {
      if (ch === '{' || ch === '(' || ch === '[') depth++
      else if (ch === '}' || ch === ')' || ch === ']') depth--
    }
  }
  return keys
}

function interfaceBlock(source, name) {
  const match = source.match(new RegExp(`interface\\s+${name}\\b[^{]*\\{`))
  if (!match) return null
  return extractBracedBlock(source, source.indexOf('{', match.index))
}

function interfaceKeys(source, name) {
  const block = interfaceBlock(source, name)
  return block === null ? null : topLevelKeys(block)
}

function interfaceEvents(source, name) {
  const block = interfaceBlock(source, name)
  if (block === null) return null
  return [...block.matchAll(/\(\s*event:\s*'([^']+)'/g)].map((match) => match[1])
}

function macroBlock(vueSource, macro) {
  const index = vueSource.indexOf(macro)
  if (index === -1) return null
  const braceIndex = vueSource.indexOf('{', index)
  if (braceIndex === -1 || braceIndex > index + 200) return null
  return extractBracedBlock(vueSource, braceIndex)
}

function macroEvents(vueSource) {
  const block = macroBlock(vueSource, 'defineEmits')
  if (block === null) return null
  const names = new Set()
  for (const match of block.matchAll(/\(\s*event:\s*'([^']+)'/g)) names.add(match[1])
  for (const match of block.matchAll(/^\s{1,4}'?([a-z][\w:-]*)'?\s*:\s*[\[(]/gm)) names.add(match[1])
  return [...names]
}

function macroExpose(vueSource) {
  const block = macroBlock(vueSource, 'defineExpose')
  if (block === null) return null
  // Split into top-level entries: commas inside method bodies sit at a deeper
  // bracket level and must not split. This keeps single-line shorthand lists
  // (`{ focus, blur }`) and multi-line object literals equally parseable.
  const entries = []
  let depth = 0
  let current = ''
  for (const ch of block) {
    if (ch === '{' || ch === '(' || ch === '[') depth++
    else if (ch === '}' || ch === ')' || ch === ']') depth--
    if (ch === ',' && depth === 0) {
      entries.push(current)
      current = ''
      continue
    }
    current += ch
  }
  entries.push(current)
  const names = new Set()
  for (const entry of entries) {
    const match = entry.match(/^\s*(?:async\s+)?['"]?(\w+)['"]?\s*(?::|\(|$)/)
    if (match) names.add(match[1])
  }
  return [...names]
}

// Public API surface that is intentionally not documented in docs tables.
const driftAllowlist = {
  Button: { methods: ['ref'] }, // native element escape hatch; `focus` is the documented entry
  Dropdown: { events: ['highlight'] }, // keyboard highlight is an internal affordance
}

for (const component of catalog.components) {
  const dir = join(componentsDir, component.id)
  const types = stripComments(readTextSafe(join(dir, 'types.ts')))
  const mainVue = stripComments(readTextSafe(join(dir, `${component.id}.vue`)))

  const source = {
    props: interfaceKeys(types, `${component.id}Props`),
    events: interfaceEvents(types, `${component.id}Emits`) ?? macroEvents(mainVue),
    slots: interfaceKeys(types, `${component.id}Slots`),
    methods: interfaceKeys(types, `${component.id}Expose`) ?? macroExpose(mainVue),
  }
  const documented = {
    props: new Set(component.props.map((item) => item.name)),
    events: new Set(component.events.map((item) => item.name)),
    slots: new Set(component.slots.map((item) => item.name)),
    methods: new Set((component.methods || []).map((item) => item.name)),
  }
  const allow = driftAllowlist[component.id] || {}
  for (const kind of ['props', 'events', 'slots', 'methods']) {
    const names = source[kind]
    if (!names) continue // no extractable source of truth for this kind
    const allowed = new Set(allow[kind] || [])
    // Docs may document the template-facing kebab-case name (`update:server-options`)
    // for a camelCase source emit (`update:serverOptions`) — both are correct.
    const missing = names.filter(
      (name) => !allowed.has(name) && !documented[kind].has(name) && !documented[kind].has(kebab(name)),
    )
    if (missing.length) {
      error(`API drift: ${component.id}.${kind} missing from docs: ${missing.join(', ')}`)
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
