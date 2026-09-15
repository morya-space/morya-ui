import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { readJson, writeJson } from './fs-utils.mjs'

const SERVER_NAME = 'morya-ui'
const SERVER_CONFIG = {
  command: 'npx',
  args: ['-y', '@morya-ui/mcp'],
}

/**
 * Merge Cursor MCP config for morya-ui.
 * @returns {{ path: string, action: 'created' | 'merged' | 'skipped' | 'forced', dryRun?: boolean }}
 */
export function mergeMcpConfig(cwd, { force = false, dryRun = false } = {}) {
  const path = join(cwd, '.cursor', 'mcp.json')
  const exists = existsSync(path)

  let data = { mcpServers: {} }
  if (exists) {
    try {
      data = readJson(path)
    } catch {
      throw new Error(`Invalid JSON in ${path}`)
    }
    if (!data || typeof data !== 'object') {
      throw new Error(`Invalid MCP config shape in ${path}`)
    }
    if (!data.mcpServers || typeof data.mcpServers !== 'object') {
      data.mcpServers = {}
    }
  }

  const hasExisting = Boolean(data.mcpServers[SERVER_NAME])
  if (hasExisting && !force) {
    return { path, action: 'skipped' }
  }

  data.mcpServers[SERVER_NAME] = { ...SERVER_CONFIG }

  if (!dryRun) {
    writeJson(path, data)
  }

  let action = 'created'
  if (exists && hasExisting && force) action = 'forced'
  else if (exists) action = 'merged'

  return { path, action, dryRun }
}
