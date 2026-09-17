import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dir = path.resolve(__dirname, '../src/components/Empty/illustrations')
const markupDir = path.join(dir, 'markup')
const manifest = JSON.parse(fs.readFileSync(path.join(dir, '_manifest.json'), 'utf8'))

const entries = manifest.map(({ key, file }) => {
  const svg = fs.readFileSync(path.join(dir, file), 'utf8').trim()
  return { key, svg }
})

const keys = entries.map((entry) => entry.key)

fs.mkdirSync(markupDir, { recursive: true })

for (const file of fs.readdirSync(markupDir)) {
  if (file.endsWith('.ts')) fs.unlinkSync(path.join(markupDir, file))
}

for (const { key, svg } of entries) {
  const fileName = `${key}.ts`
  const body = `/** Auto-generated from ${key}.svg — do not edit by hand. */\nexport default ${JSON.stringify(svg)}\n`
  fs.writeFileSync(path.join(markupDir, fileName), body)
}

let catalog =
  '/** Auto-generated illustration keys. Prefer editing SVG sources + regenerate. */\n\n'
catalog += 'export const EMPTY_ILLUSTRATION_KEYS = [\n'
for (const key of keys) catalog += `  '${key}',\n`
catalog += '] as const\n\n'
catalog +=
  'export type EmptyIllustration = (typeof EMPTY_ILLUSTRATION_KEYS)[number]\n\n'
catalog +=
  'export function isEmptyIllustration(value: string): value is EmptyIllustration {\n'
catalog +=
  '  return (EMPTY_ILLUSTRATION_KEYS as readonly string[]).includes(value)\n'
catalog += '}\n'
fs.writeFileSync(path.join(dir, 'catalog.ts'), catalog)

let loaders =
  '/** Auto-generated per-illustration loaders. Prefer editing SVG sources + regenerate. */\n\n'
loaders +=
  "import type { EmptyIllustration } from './catalog'\n\n"
loaders +=
  'type IllustrationLoader = () => Promise<{ default: string }>\n\n'
loaders +=
  'const ILLUSTRATION_LOADERS: Record<EmptyIllustration, IllustrationLoader> = {\n'
for (const key of keys) {
  loaders += `  '${key}': () => import('./markup/${key}.ts'),\n`
}
loaders += '}\n\n'
loaders +=
  '/** Load one built-in illustration SVG string (code-split friendly). */\n'
loaders +=
  'export async function loadEmptyIllustration(\n'
loaders +=
  '  name: EmptyIllustration,\n'
loaders +=
  '): Promise<string> {\n'
loaders +=
  '  const mod = await ILLUSTRATION_LOADERS[name]()\n'
loaders +=
  '  return mod.default\n'
loaders += '}\n'
fs.writeFileSync(path.join(dir, 'loaders.ts'), loaders)

console.log(
  'empty illustrations:',
  keys.length,
  'keys,',
  'catalog.ts + loaders.ts + markup/*.ts',
)
