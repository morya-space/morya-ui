/**
 * Add `pt` to Props tables where missing.
 * Attrs behavior is documented in playground/src/docs/guide/attrs.md — do not add per-component boilerplate.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { readdir } from 'node:fs/promises'

const ROOT = new URL('../src/components', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')

const SKIP = new Set([
  'Input',
  'Textarea',
  'Select',
  'Checkbox',
  'Card',
  'Dialog',
])

const FIELD = new Set([
  'AutoComplete',
  'CascadeSelect',
  'DatePicker',
  'FileUpload',
  'InputColor',
  'InputNumber',
  'InputOtp',
  'InputPassword',
  'InputTags',
  'Listbox',
  'Rating',
  'Slider',
  'TreeSelect',
])

const LABEL_CONTROL = new Set(['Radio', 'Switch'])

function ptType(name) {
  if (FIELD.has(name)) return 'FieldPassThrough'
  if (LABEL_CONTROL.has(name)) return 'ControlPassThrough'
  if (name === 'Input') return 'InputPassThrough'
  return 'RootPassThrough'
}

function propsHeading(lang) {
  return lang === 'en' ? '## Props' : '## Props'
}

function ptRow(name, lang) {
  const type = ptType(name)
  return lang === 'en'
    ? `| \`pt\` | \`${type}\` | — | Pass-through; see ${lang === 'en' ? '[Styling & attrs](/docs/attrs)' : '[样式与 attrs](/docs/attrs)'}. |\n`
    : `| \`pt\` | \`${type}\` | — | DOM 透传，见 ${lang === 'en' ? '[Styling & attrs](/docs/attrs)' : '[样式与 attrs](/docs/attrs)'}. |\n`
}

function patchContent(content, name, lang) {
  if (/\| `pt` /.test(content) || /\| `pt`\s/.test(content)) return content

  const heading = propsHeading(lang)
  const idx = content.indexOf(`\n${heading}\n`)
  if (idx === -1) return content

  const out = content

  const propsIdx = out.indexOf(`\n${heading}\n`)
  const afterProps = out.indexOf('\n## ', propsIdx + 1)
  const propsBlock = afterProps === -1 ? out.slice(propsIdx) : out.slice(propsIdx, afterProps)

  if (propsBlock.includes('| `pt`')) return out

  const tableEnd = propsBlock.lastIndexOf('\n| ')
  if (tableEnd === -1) return out
  const lineEnd = propsBlock.indexOf('\n', tableEnd + 1)
  const insertAt = propsIdx + (lineEnd === -1 ? propsBlock.length : lineEnd)
  const row = ptRow(name, lang)

  return out.slice(0, insertAt) + row + out.slice(insertAt)
}

async function walk(dir, out = []) {
  for (const name of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, name.name)
    if (name.isDirectory()) await walk(path, out)
    else if (name.name === 'index.md' || name.name === 'index.en.md') out.push(path)
  }
  return out
}

function componentName(filePath) {
  const m = filePath.replace(/\\/g, '/').match(/components\/([^/]+)\/docs\//)
  return m?.[1] ?? ''
}

const files = await walk(ROOT)
let n = 0
for (const file of files) {
  const name = componentName(file)
  if (!name || SKIP.has(name)) continue
  const lang = file.endsWith('.en.md') ? 'en' : 'zh'
  const src = await readFile(file, 'utf8')
  const next = patchContent(src, name, lang)
  if (next !== src) {
    await writeFile(file, next, 'utf8')
    n++
  }
}
console.log(`Patched ${n} doc files`)
