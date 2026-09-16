import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

const STYLE_IMPORT = "import 'morya-ui/styles.css'"
const STYLE_MARKER = 'morya-ui/styles.css'
const SHELL_MARKER = 'morya-app-shell.css'
const SHELL_REL = 'src/styles/morya-app-shell.css'

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

const SHELL_CSS = `html,
body,
#app {
  height: 100%;
  margin: 0;
}
`

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
 * @param {string} entryFile absolute
 * @param {string} shellFile absolute
 */
export function shellImportLine(entryFile, shellFile) {
  let rel = relative(dirname(entryFile), shellFile).replace(/\\/g, '/')
  if (!rel.startsWith('.')) rel = `./${rel}`
  return `import '${rel}'`
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

/**
 * Write morya-app-shell.css (height chain) and inject its import into the entry.
 * @returns {{
 *   fileAction: 'written' | 'skipped' | 'dry-run',
 *   importAction: 'injected' | 'skipped' | 'missing-entry',
 *   path?: string,
 *   entry?: string,
 *   reason?: string,
 *   dryRun?: boolean
 * }}
 */
export function ensureShellStyles(cwd, { dryRun = false, force = false } = {}) {
  const shellFile = join(cwd, SHELL_REL)
  const entry = findEntryFile(cwd)

  let fileAction = 'skipped'
  if (!existsSync(shellFile) || force) {
    if (dryRun) {
      fileAction = 'dry-run'
    }
    else {
      mkdirSync(dirname(shellFile), { recursive: true })
      writeFileSync(shellFile, SHELL_CSS, 'utf8')
      fileAction = 'written'
    }
  }

  if (!entry) {
    return {
      fileAction,
      importAction: 'missing-entry',
      path: shellFile,
      reason: 'no-entry-found',
      dryRun,
    }
  }

  const importLine = shellImportLine(entry, shellFile)
  const original = readFileSync(entry, 'utf8')
  const { source, changed, reason } = injectImportLine(original, importLine, SHELL_MARKER)

  if (!changed) {
    return {
      fileAction,
      importAction: 'skipped',
      path: shellFile,
      entry,
      reason: reason || 'already-present',
      dryRun,
    }
  }

  if (!dryRun) {
    writeFileSync(entry, source, 'utf8')
  }

  return {
    fileAction,
    importAction: 'injected',
    path: shellFile,
    entry,
    dryRun,
  }
}
