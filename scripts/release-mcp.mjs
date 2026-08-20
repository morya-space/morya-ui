import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { root } from './ui-changelog.mjs'
import { run } from './release-steps.mjs'

const MCP_PKG_PATH = join(root, 'packages/ui-mcp/package.json')
const UI_PKG_PATH = join(root, 'package.json')
const MCP_NAME = '@well-insight/ui-mcp'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const skipPublish = args.includes('--no-publish')

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

const uiPkg = readJson(UI_PKG_PATH)
const mcpPkg = readJson(MCP_PKG_PATH)
const version = String(uiPkg.version ?? '').trim()

if (!/^\d+\.\d+\.\d+/.test(version)) {
  throw new Error(`Invalid ${uiPkg.name} version: ${uiPkg.version}`)
}

console.log(`Releasing ${MCP_NAME}`)
console.log(`Sync version from ${uiPkg.name}: ${mcpPkg.version} → ${version}`)

if (dryRun) {
  console.log('Dry run: would sync version, build catalog, and publish.')
  process.exit(0)
}

if (mcpPkg.version !== version) {
  mcpPkg.version = version
  writeJson(MCP_PKG_PATH, mcpPkg)
  console.log(`Updated ${MCP_NAME} package.json to v${version}`)
} else {
  console.log(`${MCP_NAME} already at v${version}`)
}

console.log('[build] generate catalog + compile')
run('pnpm --filter @well-insight/ui-mcp build')

if (skipPublish) {
  console.log(`Built ${MCP_NAME} v${version} locally (--no-publish).`)
  process.exit(0)
}

console.log('[publish] npm')
run('pnpm --filter @well-insight/ui-mcp publish --access public --no-git-checks')
console.log(`Released ${MCP_NAME} v${version}`)
