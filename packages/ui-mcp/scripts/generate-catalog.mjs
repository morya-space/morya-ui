import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const pkgRoot = join(here, '..')
const repoRoot = join(pkgRoot, '../..')
const componentsDir = join(repoRoot, 'src/components')
const guidesDir = join(repoRoot, 'playground/src/docs/guide')
const outDir = join(pkgRoot, 'data')
const outFile = join(outDir, 'catalog.json')

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function readText(path) {
  return existsSync(path)
    ? readFileSync(path, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
    : ''
}

function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return { data: {}, body: raw }
  const end = raw.indexOf('\n---', 3)
  if (end === -1) return { data: {}, body: raw }
  const block = raw.slice(3, end).trim()
  const body = raw.slice(end + 4).replace(/^\r?\n/, '')
  const data = {}
  for (const line of block.split(/\r?\n/)) {
    // Frontmatter is line-oriented, so split at the first colon instead of using a backtracking regex.
    const colon = line.indexOf(':')
    const match = colon > 0 ? [line, line.slice(0, colon), line.slice(colon + 1).trimStart()] : null
    if (!match) continue
    data[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '')
  }
  return { data, body }
}

function slugify(title) {
  return String(title || '')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

function splitSections(body) {
  const lines = body.split(/\r?\n/)
  const sections = []
  let current = { title: '', id: 'overview', lines: [] }

  for (const line of lines) {
    const heading = line.startsWith('## ') ? line.slice(3).trim() : ''
    if (heading) {
      sections.push(current)
      const title = heading
      current = { title, id: slugify(title) || `section-${sections.length}`, lines: [] }
      continue
    }
    current.lines.push(line)
  }
  sections.push(current)
  return sections
    .map((section) => ({
      title: section.title,
      id: section.id,
      body: section.lines.join('\n').trim(),
    }))
    .filter((section) => section.body || section.title)
}

function splitTableRow(line) {
  const placeholder = '\u0000'
  const escaped = line.replace(/\\\|/g, placeholder)
  return escaped
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim().replaceAll(placeholder, '|'))
}

function isTableSeparator(line) {
  return /^\|[\s:|-]+\|$/.test(line) && line.includes('-')
}

// A section may contain several tables (e.g. Props + a sub-type table).
// Split them at separator lines so sub-tables never leak rows into the first one.
function parseMarkdownTables(body) {
  const lines = body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const tableLines = lines.filter((line) => line.startsWith('|'))
  const tables = []
  let i = 0
  while (i < tableLines.length) {
    if (i + 1 >= tableLines.length || !isTableSeparator(tableLines[i + 1])) {
      i++
      continue
    }
    const headers = splitTableRow(tableLines[i])
    const rows = []
    let j = i + 2
    while (j < tableLines.length) {
      // A line followed by a separator is the header of the next table.
      if (j + 1 < tableLines.length && isTableSeparator(tableLines[j + 1])) break
      rows.push(tableLines[j])
      j++
    }
    tables.push({
      headers,
      rows: rows.map((line) => {
        const parts = splitTableRow(line)
        if (parts.length === 0) return null
        const row = {}
        headers.forEach((header, index) => {
          row[header] = parts[index] ?? ''
        })
        return row
      }).filter(Boolean),
    })
    i = j
  }
  return tables
}

// API sections use a variety of headings: `Props`, `Props — Form`, `Grid Props`,
// `Props（MMessage）`, `Expose`, `Events / Expose — Form`, `### Props` under `## API`…
function apiKindFromTitle(title) {
  const text = String(title || '').trim()
  if (!text) return null
  const props = /\bprops?\b/i.test(text) || text.includes('属性')
  const events = /\bevents?\b/i.test(text) || text.includes('事件')
  const slots = /\bslots?\b/i.test(text) || text.includes('插槽')
  const methods = /\b(methods?|instance|expose)\b/i.test(text) || text.includes('方法') || text.includes('实例')
  const kinds = [props, events, slots, methods].filter(Boolean).length
  if (kinds > 1) {
    // `Events / Expose` tables share one ambiguously-headed table; split rows
    // by call signature. Other combos (e.g. `Slots / Events`) carry separate
    // tables per kind — let each table's header decide instead.
    if (events && methods && !props && !slots) return 'events+methods'
    return null
  }
  if (props) return 'props'
  if (events) return 'events'
  if (slots) return 'slots'
  if (methods) return 'methods'
  return null
}

// Fallback for untitled API tables (e.g. `### MPageContent` under `## API`):
// classify by the first header cell. Events tables also carry a `参数` column,
// so only the first cell is authoritative.
function apiKindFromHeader(headers) {
  const first = String(headers[0] || '').trim()
  if (/prop|参数/i.test(first)) return 'props'
  if (/slot|插槽/i.test(first)) return 'slots'
  if (/event|事件/i.test(first)) return 'events'
  if (/method|方法/i.test(first)) return 'methods'
  return null
}

function unwrapCodeName(name = '') {
  return String(name).replace(/^`+|`+$/g, '').trim()
}

function splitApiNames(value) {
  const raw = String(value || '').trim()
  // Backtick-quoted names are atomic: `` `toast.setDefaults({ position, max })` ``
  // must not split on the comma inside the signature.
  const quoted = [...raw.matchAll(/`([^`]+)`/g)].map((match) => match[1].trim()).filter(Boolean)
  const names = quoted.length ? quoted : raw.split(/\s*[/|,]\s*/)
  return names.map((name) => unwrapCodeName(name).trim()).filter(Boolean)
}

function mapApiRows(rows, kind) {
  return rows.flatMap((row) => {
    // The name column is virtually always first; fall back to it when the
    // header uses an unlisted label (e.g. `方法 / 属性`, `Method / Property`).
    const firstCell = row[Object.keys(row)[0]] ?? ''
    if (kind === 'props') {
      const names = splitApiNames(row['参数'] || row.Prop || row.Name || firstCell)
      return names.map((name) => ({
        name,
        type: unwrapCodeName(row['类型'] || row.Type || ''),
        default: unwrapCodeName(row['默认值'] || row.Default || '') || undefined,
        description: row['说明'] || row.Description || '',
      }))
    }
    if (kind === 'events') {
      const names = splitApiNames(row['事件名'] || row.Event || row.Name || firstCell)
      return names.map((name) => ({
        name,
        payload: unwrapCodeName(row['参数'] || row.Payload || row.Args || '') || undefined,
        description: row['说明'] || row.Description || '',
      }))
    }
    if (kind === 'methods') {
      const names = splitApiNames(row['方法'] || row.Method || row['名称'] || row.Name || firstCell)
      return names.map((name) => ({
        name: name.replace(/\(.*\)/, '').trim(),
        type: unwrapCodeName(row['类型'] || row.Type || '') || undefined,
        description: row['说明'] || row.Description || '',
      }))
    }
    return splitApiNames(row['插槽名'] || row.Slot || row.Name || firstCell).map((name) => ({
      name,
      description: row['说明'] || row.Description || '',
    }))
  })
}

function extractCodeBlocks(body, mdPath = '') {
  const blocks = []
  const re = /```([^\n`]*)\n([\s\S]*?)```/g
  for (const match of body.matchAll(re)) {
    const info = (match[1] || '').trim()
    const lang = info.split(/\s+/)[0] || 'text'
    const preview = /\bpreview\b/i.test(info)
    const srcMatch = info.match(/\bsrc=(?:"([^"]+)"|'([^']+)'|(\S+))/)
    let code = match[2].replace(/\s+$/, '')
    if (srcMatch && mdPath) {
      const src = srcMatch[1] || srcMatch[2] || srcMatch[3]
      const abs = join(dirname(mdPath), src)
      if (existsSync(abs)) code = readText(abs).replace(/\s+$/, '')
    }
    blocks.push({
      lang,
      preview,
      code,
    })
  }
  return blocks
}

function extractExportName(componentDir, folderName) {
  const indexPath = join(componentDir, 'index.ts')
  const index = readText(indexPath)
  const match = index.match(/export\s+\{\s*default\s+as\s+(M\w+)\s*\}/)
  if (match) return match[1]
  return `M${folderName}`
}

function extractImportHint(body, exportName) {
  const re = /import\s*\{([^}]+)\}\s*from\s*['"]morya-ui['"]/
  const match = body.match(re)
  if (match) {
    const names = match[1]
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
    if (names.includes(exportName)) {
      return `import { ${exportName} } from 'morya-ui'`
    }
    return `import { ${names.join(', ')} } from 'morya-ui'`
  }
  return `import { ${exportName} } from 'morya-ui'`
}

function buildDocLocale(raw, exportName, mdPath = '') {
  if (!raw) return null
  const { data, body } = parseFrontmatter(raw)
  const sections = splitSections(body)
  const examples = []

  for (const section of sections) {
    if (!section.title) continue
    const blocks = extractCodeBlocks(section.body, mdPath)
    for (const [index, block] of blocks.entries()) {
      if (!['vue', 'ts', 'typescript', 'js', 'javascript', 'bash', 'shell'].includes(block.lang)) continue
      examples.push({
        id: `${section.id || 'example'}-${index + 1}`,
        section: section.title,
        sectionId: section.id,
        lang: block.lang,
        preview: block.preview,
        code: block.code,
      })
    }
  }

  // Expand h2 sections into API candidates: the part before any h3 keeps the
  // section title, each `### …` becomes its own candidate. Fenced code is
  // stripped first so `###` inside examples never splits a section.
  const apiSections = sections.flatMap((section) => {
    const clean = section.body.replace(/```[\s\S]*?```/g, '')
    const subs = [{ title: '', lines: [] }]
    for (const line of clean.split(/\r?\n/)) {
      const heading = line.match(/^#{3,6}\s+(.+?)\s*$/)
      if (heading) subs.push({ title: heading[1], lines: [] })
      else subs[subs.length - 1].lines.push(line)
    }
    return subs.map((sub) => ({
      title: sub.title || section.title,
      body: sub.lines.join('\n'),
    }))
  })

  const props = []
  const events = []
  const slots = []
  const methods = []

  for (const section of apiSections) {
    const tables = parseMarkdownTables(section.body)
    if (!tables.length) continue
    const titleKind = apiKindFromTitle(section.title)
    for (const table of tables) {
      const kind = titleKind ?? apiKindFromHeader(table.headers)
      if (kind === 'events+methods') {
        // Combined tables (e.g. `Events / Expose — Form`): rows whose name
        // carries a call signature are expose methods, the rest are events.
        for (const row of table.rows) {
          const rawName = unwrapCodeName(row['名称'] || row.Name || row[Object.keys(row)[0]] || '')
          if (!rawName) continue
          const description = row['说明'] || row.Description || ''
          const call = rawName.match(/^([\w$-]+)\s*\((.*)\)$/)
          if (call) methods.push({ name: call[1], type: `(${call[2]})`, description })
          else events.push({ name: rawName, payload: undefined, description })
        }
      } else if (kind) {
        const target = { props, events, slots, methods }[kind]
        target.push(...mapApiRows(table.rows, kind))
      }
    }
  }

  const dedupeByName = (list) => [...new Map(list.map((item) => [item.name, item])).values()]

  return {
    title: data.title || '',
    category: data.category || '',
    description: data.description || '',
    import: extractImportHint(body, exportName),
    props: dedupeByName(props),
    events: dedupeByName(events),
    slots: dedupeByName(slots),
    methods: dedupeByName(methods),
    examples,
    sections: sections.map((section) => ({
      id: section.id,
      title: section.title,
      body: section.body,
    })),
    markdown: raw,
  }
}

function collectComponents() {
  const folders = readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))

  const components = []
  for (const folder of folders) {
    const dir = join(componentsDir, folder)
    const zhPath = join(dir, 'docs/index.md')
    const enPath = join(dir, 'docs/index.en.md')
    if (!existsSync(zhPath) && !existsSync(enPath)) continue

    const exportName = extractExportName(dir, folder)
    const zh = buildDocLocale(readText(zhPath), exportName, zhPath)
    const en = buildDocLocale(readText(enPath), exportName, enPath)
    const primary = zh || en

    components.push({
      id: folder,
      name: folder,
      exportName,
      category: primary?.category || '',
      description: zh?.description || en?.description || '',
      descriptionEn: en?.description || '',
      import: primary?.import || `import { ${exportName} } from 'morya-ui'`,
      props: primary?.props || [],
      events: primary?.events || [],
      slots: primary?.slots || [],
      methods: primary?.methods || [],
      examples: [
        ...(zh?.examples || []).map((item) => ({ ...item, locale: 'zh-CN' })),
        ...(en?.examples || []).map((item) => ({ ...item, locale: 'en-US' })),
      ],
      locales: {
        'zh-CN': zh
          ? {
              title: zh.title || folder,
              description: zh.description,
              sections: zh.sections,
              markdown: zh.markdown,
            }
          : null,
        'en-US': en
          ? {
              title: en.title || folder,
              description: en.description,
              sections: en.sections,
              markdown: en.markdown,
            }
          : null,
      },
    })
  }
  return components
}

function collectGuides() {
  if (!existsSync(guidesDir)) return []
  const files = readdirSync(guidesDir)
    .filter((name) => name.endsWith('.md') && !name.endsWith('.en.md'))
    .sort((a, b) => a.localeCompare(b))

  const guides = []
  for (const file of files) {
    const id = file.replace(/\.md$/, '')
    if (id === 'loadGuideDocs') continue
    const zhRaw = readText(join(guidesDir, file))
    const enRaw = readText(join(guidesDir, `${id}.en.md`))
    const zh = zhRaw ? parseFrontmatter(zhRaw) : null
    const en = enRaw ? parseFrontmatter(enRaw) : null
    const order = Number(zh?.data.order || en?.data.order || 999)

    guides.push({
      id,
      title: zh?.data.title || en?.data.title || id,
      titleEn: en?.data.title || '',
      description: zh?.data.description || en?.data.description || '',
      descriptionEn: en?.data.description || '',
      order,
      locales: {
        'zh-CN': zh
          ? {
              title: zh.data.title || id,
              description: zh.data.description || '',
              markdown: zhRaw,
              sections: splitSections(zh.body),
            }
          : null,
        'en-US': en
          ? {
              title: en.data.title || id,
              description: en.data.description || '',
              markdown: enRaw,
              sections: splitSections(en.body),
            }
          : null,
      },
    })
  }

  return guides.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
}

const uiPkg = readJson(join(repoRoot, 'package.json'))
const mcpPkg = readJson(join(pkgRoot, 'package.json'))

const catalog = {
  generatedAt: new Date().toISOString(),
  library: {
    name: uiPkg.name,
    version: uiPkg.version,
  },
  mcp: {
    name: mcpPkg.name,
    version: mcpPkg.version,
  },
  components: collectComponents(),
  guides: collectGuides(),
}

function withoutTimestamp(value) {
  const copy = { ...value }
  delete copy.generatedAt
  return copy
}

if (process.argv.includes('--check')) {
  if (!existsSync(outFile)) {
    console.error(`Catalog is missing: ${outFile}`)
    process.exitCode = 1
  } else {
    const existing = readJson(outFile)
    const expected = JSON.stringify(withoutTimestamp(catalog))
    const actual = JSON.stringify(withoutTimestamp(existing))
    if (expected !== actual) {
      console.error('Catalog is stale. Run pnpm mcp:generate and commit the result.')
      process.exitCode = 1
    } else {
      console.log(`Catalog is up to date (${catalog.components.length} components, ${catalog.guides.length} guides)`)
    }
  }
} else {
  mkdirSync(outDir, { recursive: true })
  if (existsSync(outFile)) {
    const existing = readJson(outFile)
    if (JSON.stringify(withoutTimestamp(catalog)) === JSON.stringify(withoutTimestamp(existing))) {
      console.error(
        `Catalog unchanged (${catalog.components.length} components, ${catalog.guides.length} guides); kept generatedAt`,
      )
    } else {
      writeFileSync(outFile, `${JSON.stringify(catalog, null, 2)}\n`)
      console.error(
        `Generated ${outFile} (${catalog.components.length} components, ${catalog.guides.length} guides)`,
      )
    }
  } else {
    writeFileSync(outFile, `${JSON.stringify(catalog, null, 2)}\n`)
    console.error(
      `Generated ${outFile} (${catalog.components.length} components, ${catalog.guides.length} guides)`,
    )
  }
}

await import('./copy-golden-pages.mjs')
