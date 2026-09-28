import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { readJson, writeJson } from './fs-utils.mjs'

export const SERVER_NAME = 'morya-ui'

export const SERVER_CONFIG = {
  command: 'npx',
  args: ['-y', '@morya-ui/mcp@latest'],
}

/** VS Code workspace MCP uses `servers` + optional stdio `type`. */
export const VSCODE_SERVER_CONFIG = {
  type: 'stdio',
  ...SERVER_CONFIG,
}

export const KNOWN_EDITORS = ['cursor', 'vscode', 'zed']

export const DEFAULT_EDITORS = [...KNOWN_EDITORS]

/**
 * @param {string | undefined} raw
 * @returns {string[]}
 */
export function parseEditorsFlag(raw) {
  if (raw == null || raw.trim() === '' || raw.trim() === 'all') {
    return [...DEFAULT_EDITORS]
  }
  const ids = raw
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
  if (!ids.length) return [...DEFAULT_EDITORS]

  const unknown = ids.filter((id) => !KNOWN_EDITORS.includes(id))
  if (unknown.length) {
    throw new Error(
      `Unknown editor id(s): ${unknown.join(', ')}. Available: ${KNOWN_EDITORS.join(', ')}, or all`,
    )
  }
  // Preserve declared order; dedupe
  return [...new Set(ids)]
}

/**
 * @param {unknown} data
 * @param {string} path
 */
function assertObject(data, path) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`Invalid MCP config shape in ${path}`)
  }
}

/**
 * @param {string} path
 * @param {Record<string, unknown>} fallback
 */
function readConfigOrDefault(path, fallback) {
  if (!existsSync(path)) return { data: structuredClone(fallback), exists: false }
  try {
    const data = readJson(path)
    assertObject(data, path)
    return { data, exists: true }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Invalid MCP')) {
      throw error
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in ${path}`)
    }
    throw error
  }
}

/**
 * @param {object} args
 * @param {string} args.path
 * @param {boolean} args.exists
 * @param {Record<string, unknown>} args.data
 * @param {string} args.bucketKey
 * @param {Record<string, unknown>} args.serverConfig
 * @param {boolean} args.force
 * @param {boolean} args.dryRun
 * @param {string} args.editor
 * @returns {{ editor: string, path: string, action: 'created' | 'merged' | 'skipped' | 'forced', dryRun?: boolean }}
 */
function mergeServerEntry({ path, exists, data, bucketKey, serverConfig, force, dryRun, editor }) {
  if (!data[bucketKey] || typeof data[bucketKey] !== 'object' || Array.isArray(data[bucketKey])) {
    data[bucketKey] = {}
  }
  const bucket = /** @type {Record<string, unknown>} */ (data[bucketKey])
  const hasExisting = Boolean(bucket[SERVER_NAME])
  if (hasExisting && !force) {
    return { editor, path, action: 'skipped', dryRun }
  }

  bucket[SERVER_NAME] = { ...serverConfig }

  if (!dryRun) {
    writeJson(path, data)
  }

  let action = 'created'
  if (exists && hasExisting && force) action = 'forced'
  else if (exists) action = 'merged'

  return { editor, path, action, dryRun }
}

/**
 * @param {string} cwd
 * @param {{ force?: boolean, dryRun?: boolean }} [options]
 */
function mergeCursorMcp(cwd, { force = false, dryRun = false } = {}) {
  const path = join(cwd, '.cursor', 'mcp.json')
  const { data, exists } = readConfigOrDefault(path, { mcpServers: {} })
  return mergeServerEntry({
    path,
    exists,
    data,
    bucketKey: 'mcpServers',
    serverConfig: SERVER_CONFIG,
    force,
    dryRun,
    editor: 'cursor',
  })
}

/**
 * Portable root config (Agent Host / cross-tool discovery).
 * @param {string} cwd
 * @param {{ force?: boolean, dryRun?: boolean }} [options]
 */
function mergePortableMcp(cwd, { force = false, dryRun = false } = {}) {
  const path = join(cwd, '.mcp.json')
  const { data, exists } = readConfigOrDefault(path, { mcpServers: {} })
  return mergeServerEntry({
    path,
    exists,
    data,
    bucketKey: 'mcpServers',
    serverConfig: SERVER_CONFIG,
    force,
    dryRun,
    editor: 'portable',
  })
}

/**
 * @param {string} cwd
 * @param {{ force?: boolean, dryRun?: boolean }} [options]
 */
function mergeVscodeMcp(cwd, { force = false, dryRun = false } = {}) {
  const path = join(cwd, '.vscode', 'mcp.json')
  const { data, exists } = readConfigOrDefault(path, { servers: {} })
  return mergeServerEntry({
    path,
    exists,
    data,
    bucketKey: 'servers',
    serverConfig: VSCODE_SERVER_CONFIG,
    force,
    dryRun,
    editor: 'vscode',
  })
}

/**
 * Merge into `.zed/settings.json` under `context_servers` without wiping other settings.
 * @param {string} cwd
 * @param {{ force?: boolean, dryRun?: boolean }} [options]
 */
function mergeZedMcp(cwd, { force = false, dryRun = false } = {}) {
  const path = join(cwd, '.zed', 'settings.json')
  const { data, exists } = readConfigOrDefault(path, {})
  return mergeServerEntry({
    path,
    exists,
    data,
    bucketKey: 'context_servers',
    serverConfig: SERVER_CONFIG,
    force,
    dryRun,
    editor: 'zed',
  })
}

const EDITOR_MERGERS = {
  cursor: mergeCursorMcp,
  vscode: mergeVscodeMcp,
  zed: mergeZedMcp,
}

/**
 * Merge morya-ui MCP into the selected editors plus root `.mcp.json`.
 *
 * @param {string} cwd
 * @param {{ force?: boolean, dryRun?: boolean, editors?: string[] }} [options]
 * @returns {{ results: Array<{ editor: string, path: string, action: string, dryRun?: boolean }>, dryRun?: boolean }}
 */
export function mergeMcpConfig(cwd, { force = false, dryRun = false, editors = DEFAULT_EDITORS } = {}) {
  const selected = Array.isArray(editors)
    ? parseEditorsFlag(editors.join(','))
    : parseEditorsFlag(editors)
  /** @type {Array<{ editor: string, path: string, action: string, dryRun?: boolean }>} */
  const results = []

  for (const editor of selected) {
    const merge = EDITOR_MERGERS[editor]
    if (!merge) throw new Error(`Unknown editor: ${editor}`)
    results.push(merge(cwd, { force, dryRun }))
  }

  // Always write portable root config when MCP step runs.
  results.push(mergePortableMcp(cwd, { force, dryRun }))

  return { results, dryRun }
}
