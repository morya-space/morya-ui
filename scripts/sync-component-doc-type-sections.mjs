/**
 * Add or extend component doc "## 类型" sections from types.ts exports.
 * Links in Props/Events tables resolve to <h4 id="TypeName"> anchors.
 * Run: node scripts/sync-component-doc-type-sections.mjs
 */
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const COMPONENTS = fileURLToPath(new URL('../src/components', import.meta.url))

const SKIP_EXPORT = /(Props|Emits|Instance)$/

function extractTypeAlias(source, startIndex, name) {
  const eq = source.indexOf('=', startIndex)
  if (eq === -1) return null

  let i = eq + 1
  while (i < source.length && /\s/.test(source[i])) i++

  let depth = 0
  let value = ''
  for (; i < source.length; i++) {
    const ch = source[i]
    if (depth === 0 && ch === '\n') {
      const next = source.slice(i + 1).match(/^\s*(export\s|\/\/|\/\*|$)/)
      if (next) break
    }
    if (ch === '{') depth++
    else if (ch === '}') depth--
    value += ch
  }

  const body = `type ${name} = ${value.trim()}`
  return body.length > name.length + 8 ? body : null
}

function extractInterface(source, startIndex, name) {
  const headerEnd = source.indexOf('{', startIndex)
  if (headerEnd === -1) return null

  let depth = 0
  let end = headerEnd
  for (let i = headerEnd; i < source.length; i++) {
    if (source[i] === '{') depth++
    else if (source[i] === '}') {
      depth--
      if (depth === 0) {
        end = i + 1
        break
      }
    }
  }

  const header = source.slice(startIndex, headerEnd).replace(/^export\s+/, '').trim()
  const block = source.slice(headerEnd, end).trim()
  return `${header} ${block}`.trim()
}

function extractExports(source) {
  const items = []
  const re = /^export (type|interface) (\w+)/gm
  let match
  while ((match = re.exec(source)) !== null) {
    const name = match[2]
    if (SKIP_EXPORT.test(name)) continue

    const body =
      match[1] === 'interface'
        ? extractInterface(source, match.index, name)
        : extractTypeAlias(source, match.index, name)

    if (body) items.push({ name, body })
  }
  return items
}

function referencedTypes(doc) {
  const names = new Set()
  for (const m of doc.matchAll(/`([A-Z][A-Za-z0-9]*)(?:\[\])?`/g)) names.add(m[1])
  return names
}

function existingTypeIds(doc) {
  const ids = new Set()
  for (const m of doc.matchAll(/<h4 id="([^"]+)"/g)) ids.add(m[1])
  return ids
}

function removeEmptyTypeBlocks(doc) {
  return doc.replace(
    /<h4 id="[^"]+">[^<]+<\/h4>\n\n(?:完整定义见源码 `types\.ts`。?|See source `types\.ts` for the full definition\.)\n\n```ts\n\n```\n\n/g,
    '',
  )
}

function blockFor(name, body, lang) {
  const intro =
    lang === 'en'
      ? `See source \`types.ts\` for the full definition.`
      : `完整定义见源码 \`types.ts\`。`
  return `<h4 id="${name}">${name}</h4>\n\n${intro}\n\n\`\`\`ts\n${body}\n\`\`\`\n\n`
}

function sectionHeading(lang) {
  return lang === 'en' ? '## Types' : '## 类型'
}

function extractTypeSection(doc, lang) {
  const heading = sectionHeading(lang)
  const marker = `\n${heading}\n`
  const idx = doc.indexOf(marker)
  if (idx === -1) return null

  const bodyStart = idx + marker.length
  const rest = doc.slice(bodyStart)
  const nextMatch = rest.match(/\n## /)
  const bodyEnd = nextMatch ? bodyStart + nextMatch.index : doc.length
  const tail = nextMatch ? doc.slice(bodyEnd).trim() : ''

  return {
    before: doc.slice(0, idx).trimEnd(),
    body: doc.slice(bodyStart, bodyEnd).trim(),
    tail,
    heading,
  }
}

function appendTypeSection(doc, section, lang) {
  const heading = sectionHeading(lang)
  const extracted = extractTypeSection(doc, lang)

  if (extracted) {
    const middle = extracted.tail ? `\n\n${extracted.tail}` : ''
    const body = extracted.body ? `${extracted.body}\n\n${section}` : section
    return `${extracted.before}${middle}\n\n${heading}\n\n${body}\n`
  }

  return `${doc.trimEnd()}\n\n${heading}\n\n${section}\n`
}

async function walk(dir, out = []) {
  for (const name of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, name.name)
    if (name.isDirectory()) await walk(path, out)
    else if (name.name === 'index.md' || name.name === 'index.en.md') out.push(path)
  }
  return out
}

let updated = 0
for (const docPath of await walk(COMPONENTS)) {
  const lang = docPath.endsWith('.en.md') ? 'en' : 'zh'
  const componentDir = docPath.replace(/[/\\]docs[/\\]index(\.en)?\.md$/, '')
  const typesPath = join(componentDir, 'types.ts')
  let typesSource
  try {
    typesSource = await readFile(typesPath, 'utf8')
  } catch {
    continue
  }

  const exports = extractExports(typesSource)
  if (!exports.length) continue

  let doc = await readFile(docPath, 'utf8')
  doc = removeEmptyTypeBlocks(doc)

  const refs = referencedTypes(doc)
  const existing = existingTypeIds(doc)

  const toAdd = exports.filter((item) => refs.has(item.name) && !existing.has(item.name))
  if (!toAdd.length && doc === await readFile(docPath, 'utf8')) continue

  const blocks = toAdd.map((item) => blockFor(item.name, item.body, lang)).join('')
  const heading = sectionHeading(lang)
  let next = doc

  if (blocks) {
    next = appendTypeSection(doc, blocks, lang)
  }

  if (next !== await readFile(docPath, 'utf8')) {
    await writeFile(docPath, next, 'utf8')
    updated++
  }
}

console.log(`Updated type sections in ${updated} component doc files`)
