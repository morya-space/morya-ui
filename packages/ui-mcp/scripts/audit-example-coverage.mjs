import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const pkgRoot = join(here, '..')
const repoRoot = join(pkgRoot, '../..')
const catalog = JSON.parse(readFileSync(join(pkgRoot, 'data/catalog.json'), 'utf8'))
const reportPath = join(pkgRoot, 'data/example-coverage.json')

function kebab(value) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}

function apiNames(value) {
  return unique(
    String(value)
      .split(/[\s`/|,]+/)
      .map((name) => name.trim().replace(/^\[|\]$/g, ''))
      .filter((name) => /^[a-z_$][\w$:-]*$/i.test(name)),
  )
}

function unique(values) {
  return [...new Set(values)]
}

function documentedMethods(component) {
  return unique((component.methods || []).map((method) => method.name).filter(Boolean))
}

function sourceMethods(id) {
  const file = join(repoRoot, 'src/components', id, `${id}.vue`)
  if (!existsSync(file)) return []
  const source = readFileSync(file, 'utf8')
  const blocks = [...source.matchAll(/defineExpose\s*\(\s*\{([\s\S]*?)\}\s*\)/g)]
  return unique(
    blocks.flatMap((block) =>
      block[1]
        .split(',')
        .map((entry) => entry.split(':')[0].trim())
        .filter((name) => /^[a-z_$][\w$]*$/i.test(name)),
    ),
  )
}

function componentCoverage(component) {
  const examples = component.examples.map((example) => example.code).join('\n')
  const props = unique(component.props.flatMap((prop) => apiNames(prop.name)))
  const events = unique(component.events.flatMap((event) => apiNames(event.name)))
  const slots = unique(component.slots.flatMap((slot) => apiNames(slot.name)))
  const methods = unique([...documentedMethods(component), ...sourceMethods(component.id)])

  const coveredProps = props.filter((prop) => {
    const name = kebab(prop)
    return new RegExp(`(?:^|[\\s:@])${prop}(?:[\\s=/>]|$)`, 'i').test(examples) ||
      new RegExp(`(?:^|[\\s:@])${name}(?:[\\s=/>]|$)`, 'i').test(examples) ||
      (prop === 'modelValue' && /v-model(?:[:=]|\\s)/i.test(examples))
  })
  const coveredEvents = events.filter((event) =>
    examples.includes(`@${event}`) ||
    examples.includes(`@${kebab(event)}`) ||
    (event.startsWith('update:') && examples.includes(`v-model:${kebab(event.slice(7))}`)),
  )
  const coveredSlots = slots.filter((slot) =>
    examples.includes(`#${slot}`) ||
    (slot === 'default' && examples.includes('<Wd') && examples.includes('</Wd')),
  )
  const coveredMethods = methods.filter((method) =>
    new RegExp(`(?:\\.|ref\\?\\.)${method}\\s*\\(`).test(examples) ||
      examples.includes(`\`${method}\``),
  )

  return {
    id: component.id,
    exportName: component.exportName,
    examples: component.examples.length,
    props: { total: props.length, covered: coveredProps.length, missing: props.filter((name) => !coveredProps.includes(name)) },
    events: { total: events.length, covered: coveredEvents.length, missing: events.filter((name) => !coveredEvents.includes(name)) },
    slots: { total: slots.length, covered: coveredSlots.length, missing: slots.filter((name) => !coveredSlots.includes(name)) },
    methods: { total: methods.length, covered: coveredMethods.length, missing: methods.filter((name) => !coveredMethods.includes(name)) },
  }
}

const components = catalog.components.map(componentCoverage)
const report = {
  generatedAt: new Date().toISOString(),
  catalogGeneratedAt: catalog.generatedAt,
  components,
  summary: {
    components: components.length,
    componentsWithMissingCoverage: components.filter((item) =>
      item.props.missing.length || item.events.missing.length || item.slots.missing.length || item.methods.missing.length,
    ).length,
    totalExamples: components.reduce((sum, item) => sum + item.examples, 0),
  },
}

if (process.argv.includes('--write')) {
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
  console.log(`Wrote ${reportPath}`)
}

console.log(JSON.stringify(report.summary, null, 2))
for (const item of components.filter((component) =>
  component.props.missing.length || component.events.missing.length || component.slots.missing.length || component.methods.missing.length,
)) {
  console.log(`\n${item.id} (${item.examples} examples)`)
  for (const kind of ['props', 'events', 'slots', 'methods']) {
    if (item[kind].missing.length) console.log(`  ${kind}: ${item[kind].missing.join(', ')}`)
  }
}

if (process.argv.includes('--strict') && report.summary.componentsWithMissingCoverage > 0) {
  process.exitCode = 1
}
