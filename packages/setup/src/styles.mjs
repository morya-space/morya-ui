import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const STYLE_IMPORT = "import 'morya-ui/styles.css'"
const STYLE_MARKER = 'morya-ui/styles.css'

const CANDIDATES = [
  'src/main.ts',
  'src/main.js',
  'src/main.tsx',
  'src/main.jsx',
  'main.ts',
  'main.js',
  'src/app.ts',
  'src/app.js',
]

/**
 * @param {string} cwd
 * @returns {string | null} absolute path
 */
export function findEntryFile(cwd) {
  for (const rel of CANDIDATES) {
    const full = join(cwd, rel)
    if (existsSync(full)) return full
  }

  const indexHtml = join(cwd, 'index.html')
  if (existsSync(indexHtml)) {
    const html = readFileSync(indexHtml, 'utf8')
    const match = html.match(/<script[^>]*type=["']module["'][^>]*src=["']([^"']+)["']/i)
      || html.match(/<script[^>]*src=["']([^"']+)["'][^>]*type=["']module["']/i)
    if (match?.[1]) {
      const src = match[1].replace(/^\//, '')
      const full = resolve(cwd, src)
      if (existsSync(full)) return full
    }
  }

  return null
}

/**
 * Insert an import after the last leading import, or at top.
 * @param {string} source
 * @param {string} importLine
 * @param {string} marker substring that means "already present"
 */
export function injectImportLine(source, importLine, marker) {
  if (source.includes(marker)) {
    return { source, changed: false, reason: 'already-present' }
  }

  const lines = source.split(/\r?\n/)
  let lastImportIndex = -1
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) {
      if (lastImportIndex >= 0) continue
      continue
    }
    if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
      if (lastImportIndex < 0) continue
      break
    }
    if (/^import\s/.test(line) || /^import["']/.test(line)) {
      lastImportIndex = i
      continue
    }
    break
  }

  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, importLine)
  }
  else {
    let insertAt = 0
    if (lines[0]?.startsWith('#!')) insertAt = 1
    lines.splice(insertAt, 0, importLine, '')
  }

  return { source: lines.join('\n'), changed: true }
}

/**
 * @param {string} source
 * @deprecated use injectImportLine
 */
export function injectStyleImport(source) {
  return injectImportLine(source, STYLE_IMPORT, STYLE_MARKER)
}

/**
 * @returns {{
 *   action: 'injected' | 'skipped' | 'missing-entry',
 *   path?: string,
 *   reason?: string,
 *   dryRun?: boolean
 * }}
 */
export function ensureStylesImport(cwd, { dryRun = false } = {}) {
  const entry = findEntryFile(cwd)
  if (!entry) {
    return { action: 'missing-entry', reason: 'no-entry-found' }
  }

  const original = readFileSync(entry, 'utf8')
  const { source, changed, reason } = injectImportLine(original, STYLE_IMPORT, STYLE_MARKER)

  if (!changed) {
    return { action: 'skipped', path: entry, reason: reason || 'already-present' }
  }

  if (!dryRun) {
    writeFileSync(entry, source, 'utf8')
  }

  return { action: 'injected', path: entry, dryRun }
}
