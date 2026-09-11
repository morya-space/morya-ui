/**
 * Fix broken Props rows and link common type names to /docs/types.
 * Run: node scripts/enrich-component-doc-types.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

const ROOT = new URL('../src/components', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')

/** type name → [markdown type cell, optional 说明 suffix (zh), optional (en)] */
const TYPES = {
  PassThroughPart: [
    '[PassThroughPart](/docs/types#PassThroughPart)',
    '见 API 类型',
    'See API types',
  ],
  RootPassThrough: [
    '[RootPassThrough](/docs/types#RootPassThrough) `{ root? }`',
    '',
    '',
  ],
  ControlPassThrough: [
    '[ControlPassThrough](/docs/types#ControlPassThrough) `{ root?, input? }`',
    '',
    '',
  ],
  FieldPassThrough: [
    '[FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }`',
    '',
    '',
  ],
  InputPassThrough: [
    '[InputPassThrough](/docs/types#InputPassThrough)',
    '含 prefix / suffix / help / count',
    'includes prefix / suffix / help / count',
  ],
  MSizeInput: [
    '[MSizeInput](/docs/types#MSizeInput)',
    '',
    '',
  ],
  MInputVariant: [
    '[MInputVariant](/docs/types#MInputVariant)',
    '',
    '',
  ],
  ButtonSeverity: [
    '[ButtonSeverity](/docs/types#ButtonSeverity)',
    '',
    '',
  ],
  MAppendTo: [
    '[MAppendTo](/docs/types#MAppendTo)',
    '',
    '',
  ],
  AsyncGuard: [
    '[AsyncGuard](/docs/types#AsyncGuard)',
    '返回 false 则拦截',
    'return false to block',
  ],
  SelectOption: [
    '[SelectOption](/docs/types#SelectOption) `{ label, value, disabled? }`',
    '',
    '',
  ],
  SelectModelValue: [
    '[SelectModelValue](/docs/types#SelectModelValue)',
    '',
    '',
  ],
  IconName: [
    '[IconName](/docs/types#IconName)',
    '',
    '',
  ],
  MSeverity: [
    '[MSeverity](/docs/types#MSeverity)',
    '',
    '',
  ],
}

function fixBrokenPtRows(content) {
  let out = content.replace(/\|\| `pt`/g, '\n| `pt`')
  const lines = out.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith('| `pt`')) continue
    const prev = lines[i - 1]
    if (prev && prev.startsWith('|') && !prev.trimEnd().endsWith('|')) {
      lines[i - 1] = `${prev.trimEnd()} |`
    }
  }
  return lines.join('\n')
}

function enrichTableTypes(content) {
  let out = content
  for (const [name, [linked]] of Object.entries(TYPES)) {
    const plain = `\`${name}\``
    if (!out.includes(plain)) continue
    // Table type column: | … | `TypeName` | …
    out = out.replace(
      new RegExp(`(\\|[^\n]*\\| )${plain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}( \\|)`, 'g'),
      `$1${linked}$2`,
    )
  }
  return out
}

async function walk(dir, out = []) {
  for (const name of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, name.name)
    if (name.isDirectory()) await walk(path, out)
    else if (name.name === 'index.md' || name.name === 'index.en.md') out.push(path)
  }
  return out
}

const files = await walk(ROOT)
let n = 0
for (const file of files) {
  const lang = file.endsWith('.en.md') ? 'en' : 'zh'
  const src = await readFile(file, 'utf8')
  let next = fixBrokenPtRows(src)
  next = enrichTableTypes(next)
  if (next !== src) {
    await writeFile(file, next, 'utf8')
    n++
  }
}
console.log(`Enriched ${n} doc files`)
