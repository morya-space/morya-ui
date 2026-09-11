/**
 * Move "## 类型" / "## Types" sections to the end of each component doc.
 * Run: node scripts/move-component-doc-types-to-bottom.mjs
 */
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const COMPONENTS = fileURLToPath(new URL('../src/components', import.meta.url))

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

function moveTypesToBottom(doc, lang) {
  const extracted = extractTypeSection(doc, lang)
  if (!extracted) return doc

  const { before, body, tail, heading } = extracted
  const middle = tail ? `\n\n${tail}` : ''
  return `${before}${middle}\n\n${heading}\n\n${body}\n`
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
  const src = await readFile(docPath, 'utf8')
  const next = moveTypesToBottom(src, lang)
  if (next !== src) {
    await writeFile(docPath, next, 'utf8')
    updated++
  }
}

console.log(`Moved type sections to bottom in ${updated} doc files`)
