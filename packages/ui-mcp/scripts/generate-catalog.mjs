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
  return existsSync(path) ? readFileSync(path, 'utf8').replace(/^\uFEFF/, '') : ''
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

function parseMarkdownTable(body) {
  const lines = body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const tableLines = lines.filter((line) => line.startsWith('|'))
  if (tableLines.length < 2) return []

  const headers = splitTableRow(tableLines[0])
  const rows = []
  for (const line of tableLines.slice(2)) {
    const parts = splitTableRow(line)
    if (parts.length === 0) continue
    const row = {}
    headers.forEach((header, index) => {
      row[header] = parts[index] ?? ''
    })
    rows.push(row)
  }
  return rows
}

function unwrapCodeName(name = '') {
  return String(name).replace(/^`+|`+$/g, '').trim()
}

function splitApiNames(value) {
  return unwrapCodeName(value)
    .split(/\s*[`/|,]\s*/)
    .map((name) => unwrapCodeName(name).trim())
    .filter(Boolean)
}

function mapApiRows(rows, kind) {
  return rows.flatMap((row) => {
    if (kind === 'props') {
      const names = splitApiNames(row['参数'] || row.Prop || row.Name || '')
      return names.map((name) => ({
        name,
        type: unwrapCodeName(row['类型'] || row.Type || ''),
        default: unwrapCodeName(row['默认值'] || row.Default || '') || undefined,
        description: row['说明'] || row.Description || '',
      }))
    }
    if (kind === 'events') {
      const names = splitApiNames(row['事件名'] || row.Event || row.Name || '')
      return names.map((name) => ({
        name,
        payload: unwrapCodeName(row['参数'] || row.Payload || row.Args || '') || undefined,
        description: row['说明'] || row.Description || '',
      }))
    }
    return splitApiNames(row['插槽名'] || row.Slot || row.Name || '').map((name) => ({
      name,
      description: row['说明'] || row.Description || '',
    }))
  })
}

function extractCodeBlocks(body) {
  const blocks = []
  const re = /```([^\n`]*)\n([\s\S]*?)```/g
  for (const match of body.matchAll(re)) {
    const info = (match[1] || '').trim()
    const lang = info.split(/\s+/)[0] || 'text'
    const preview = /\bpreview\b/i.test(info)
    blocks.push({
      lang,
      preview,
      code: match[2].replace(/\s+$/, ''),
    })
  }
  return blocks
}

function extractExportName(componentDir, folderName) {
  const indexPath = join(componentDir, 'index.ts')
  const index = readText(indexPath)
  const match = index.match(/export\s+\{\s*default\s+as\s+(Wi\w+)\s*\}/)
  if (match) return match[1]
  return `Wi${folderName}`
}

function extractImportHint(body, exportName) {
  const re = /import\s*\{([^}]+)\}\s*from\s*['"]@well-insight\/ui['"]/
  const match = body.match(re)
  if (match) {
    const names = match[1]
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
    if (names.includes(exportName)) {
      return `import { ${exportName} } from '@well-insight/ui'`
    }
    return `import { ${names.join(', ')} } from '@well-insight/ui'`
  }
  return `import { ${exportName} } from '@well-insight/ui'`
}

function buildDocLocale(raw, exportName) {
  if (!raw) return null
  const { data, body } = parseFrontmatter(raw)
  const sections = splitSections(body)
  const examples = []

  for (const section of sections) {
    if (!section.title) continue
    const blocks = extractCodeBlocks(section.body)
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

  const propsSection = sections.find((section) => /^(props|属性)$/i.test(section.title))
  const eventsSection = sections.find((section) => /^(events|事件)$/i.test(section.title))
  const slotsSection = sections.find((section) => /^(slots|插槽)$/i.test(section.title))

  return {
    title: data.title || '',
    category: data.category || '',
    description: data.description || '',
    import: extractImportHint(body, exportName),
    props: propsSection ? mapApiRows(parseMarkdownTable(propsSection.body), 'props') : [],
    events: eventsSection ? mapApiRows(parseMarkdownTable(eventsSection.body), 'events') : [],
    slots: slotsSection ? mapApiRows(parseMarkdownTable(slotsSection.body), 'slots') : [],
    methods: (() => {
      const methodsSection = sections.find((section) => /^(methods|instance|实例|方法)$/i.test(section.title))
      return methodsSection
        ? parseMarkdownTable(methodsSection.body).map((row) => ({
            name: splitApiNames(row['方法'] || row.Method || row.Name || '')[0] || '',
            type: unwrapCodeName(row['类型'] || row.Type || '') || undefined,
            description: row['说明'] || row.Description || '',
          })).filter((item) => item.name)
        : []
    })(),
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
    const zh = buildDocLocale(readText(zhPath), exportName)
    const en = buildDocLocale(readText(enPath), exportName)
    const primary = zh || en

    components.push({
      id: folder,
      name: folder,
      exportName,
      category: primary?.category || '',
      description: zh?.description || en?.description || '',
      descriptionEn: en?.description || '',
      import: primary?.import || `import { ${exportName} } from '@well-insight/ui'`,
      props: primary?.props || [],
      events: primary?.events || [],
      slots: primary?.slots || [],
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
  writeFileSync(outFile, `${JSON.stringify(catalog, null, 2)}\n`)
  console.error(
    `Generated ${outFile} (${catalog.components.length} components, ${catalog.guides.length} guides)`,
  )
}
