import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { git, run } from './release-steps.mjs'
import { root } from './ui-changelog.mjs'

export const MCP_NAME = '@well-insight/ui-mcp'
export const MCP_PKG_PATH = join(root, 'packages/ui-mcp/package.json')
export const MCP_RELEASE_PATHS = [
  'packages/ui-mcp/package.json',
  'packages/ui-mcp/data/catalog.json',
  'packages/ui-mcp/data/example-coverage.json',
]

const UI_PKG_PATH = join(root, 'package.json')

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

function hasStagedChanges() {
  return Boolean(git(['diff', '--cached', '--name-only'], { allowFail: true }))
}

export function readUiVersion() {
  const uiPkg = readJson(UI_PKG_PATH)
  const version = String(uiPkg.version ?? '').trim()
  if (!/^\d+\.\d+\.\d+/.test(version)) {
    throw new Error(`Invalid ${uiPkg.name} version: ${uiPkg.version}`)
  }
  return { uiPkg, version }
}

/** Align @well-insight/ui-mcp version with @well-insight/ui. */
export function syncMcpVersion(version = readUiVersion().version) {
  const mcpPkg = readJson(MCP_PKG_PATH)
  if (mcpPkg.version === version) {
    console.log(`${MCP_NAME} already at v${version}`)
    return false
  }
  mcpPkg.version = version
  writeJson(MCP_PKG_PATH, mcpPkg)
  console.log(`Updated ${MCP_NAME} package.json to v${version}`)
  return true
}

export function buildMcp() {
  console.log('[build] @well-insight/ui-mcp (catalog + compile)')
  run('pnpm --filter @well-insight/ui-mcp build')
  console.log('[check] @well-insight/ui-mcp catalog')
  run('pnpm mcp:validate-catalog')
  console.log('[audit] @well-insight/ui-mcp example coverage')
  run('pnpm mcp:audit-examples -- --write')
}

export function commitMcpRelease(version = readUiVersion().version) {
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

export function publishMcp() {
  console.log('[publish] @well-insight/ui-mcp')
  run('pnpm --filter @well-insight/ui-mcp publish --access public --no-git-checks')
}

/**
 * Standalone MCP release: sync version → build → commit → publish.
 * Used by `pnpm release:mcp`.
 */
export function runMcpRelease({
  dryRun = false,
  skipPublish = false,
  skipCommit = false,
} = {}) {
  const { uiPkg, version } = readUiVersion()
  const mcpPkg = readJson(MCP_PKG_PATH)

  console.log(`Releasing ${MCP_NAME}`)
  console.log(`Sync version from ${uiPkg.name}: ${mcpPkg.version} → ${version}`)

  if (dryRun) {
    console.log('Dry run: would sync version, build catalog, commit release files, and publish.')
    return { version, dryRun: true }
  }

  syncMcpVersion(version)
  buildMcp()

  if (!skipCommit) commitMcpRelease(version)
  else console.log('Skipped commit (--no-commit)')

  if (skipPublish) {
    console.log(`Built ${MCP_NAME} v${version} locally (--no-publish).`)
    return { version, published: false }
  }

  publishMcp()
  console.log(`Released ${MCP_NAME} v${version}`)
  return { version, published: true }
}

const isCli =
  Boolean(process.argv[1]) && import.meta.url === pathToFileURL(resolve(process.argv[1])).href

if (isCli) {
  const args = process.argv.slice(2)
  runMcpRelease({
    dryRun: args.includes('--dry-run'),
    skipPublish: args.includes('--no-publish'),
    skipCommit: args.includes('--no-commit'),
  })
}
