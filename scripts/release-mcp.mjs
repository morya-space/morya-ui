import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { root } from './ui-changelog.mjs'
import { git, run } from './release-steps.mjs'

const MCP_PKG_PATH = join(root, 'packages/ui-mcp/package.json')
const UI_PKG_PATH = join(root, 'package.json')
const MCP_NAME = '@well-insight/ui-mcp'
const MCP_RELEASE_PATHS = ['packages/ui-mcp/package.json', 'packages/ui-mcp/data/catalog.json']

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const skipPublish = args.includes('--no-publish')
const skipCommit = args.includes('--no-commit')

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

function hasStagedChanges() {
  return Boolean(git(['diff', '--cached', '--name-only'], { allowFail: true }))
}

function commitMcpRelease(version) {
  console.log('[commit] mcp release files')
  git(['add', '--', ...MCP_RELEASE_PATHS], { allowFail: true })
  if (hasStagedChanges()) {
    git(['commit', '-m', `release: ${MCP_NAME} v${version}`], { stdio: 'inherit' })
    console.log(`Committed release: ${MCP_NAME} v${version}`)
    return true
  }

  console.log('No MCP version files to commit')
  return false
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
  console.log('Dry run: would sync version, build catalog, commit release files, and publish.')
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

if (!skipCommit) {
  commitMcpRelease(version)
} else {
  console.log('Skipped commit (--no-commit)')
}

if (skipPublish) {
  console.log(`Built ${MCP_NAME} v${version} locally (--no-publish).`)
  process.exit(0)
}

console.log('[publish] npm')
run('pnpm --filter @well-insight/ui-mcp publish --access public --no-git-checks')
console.log(`Released ${MCP_NAME} v${version}`)
