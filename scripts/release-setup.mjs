import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { run } from './release-steps.mjs'
import { root } from './ui-changelog.mjs'

export const SETUP_NAME = '@morya-ui/setup'
export const SETUP_PKG_PATH = join(root, 'packages/setup/package.json')
export const SETUP_RELEASE_PATHS = [
  'packages/setup/package.json',
  'packages/setup/template',
]

const UI_PKG_PATH = join(root, 'package.json')

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

export function readUiVersion() {
  const uiPkg = readJson(UI_PKG_PATH)
  const version = String(uiPkg.version ?? '').trim()
  if (!/^\d+\.\d+\.\d+/.test(version)) {
    throw new Error(`Invalid ${uiPkg.name} version: ${uiPkg.version}`)
  }
  return { uiPkg, version }
}

/** Align @morya-ui/setup version with morya-ui. */
export function syncSetupVersion(version = readUiVersion().version) {
  const setupPkg = readJson(SETUP_PKG_PATH)
  if (setupPkg.version === version) {
    console.log(`${SETUP_NAME} already at v${version}`)
    return false
  }
  setupPkg.version = version
  writeJson(SETUP_PKG_PATH, setupPkg)
  console.log(`Updated ${SETUP_NAME} package.json to v${version}`)
  return true
}

export function buildSetup() {
  console.log('[build] @morya-ui/setup (sync template)')
  run('pnpm --filter @morya-ui/setup build')
}

export function publishSetup() {
  console.log('[publish] @morya-ui/setup')
  // Template already synced in build; skip prepublishOnly rewrite churn.
  run('pnpm --filter @morya-ui/setup publish --access public --no-git-checks --ignore-scripts')
}

/**
 * Standalone setup release: sync version → sync template → publish.
 * Used by `pnpm release:setup`.
 */
export function runSetupRelease({
  dryRun = false,
  skipPublish = false,
} = {}) {
  const { uiPkg, version } = readUiVersion()
  const setupPkg = readJson(SETUP_PKG_PATH)

  console.log(`Releasing ${SETUP_NAME}`)
  console.log(`Sync version from ${uiPkg.name}: ${setupPkg.version} → ${version}`)

  if (dryRun) {
    console.log('Dry run: would sync version, sync template, and publish.')
    return { version, dryRun: true }
  }

  syncSetupVersion(version)
  buildSetup()

  if (skipPublish) {
    console.log(`Built ${SETUP_NAME} v${version} locally (--no-publish).`)
    return { version, published: false }
  }

  publishSetup()
  console.log(`Released ${SETUP_NAME} v${version}`)
  return { version, published: true }
}

const isCli =
  Boolean(process.argv[1]) && import.meta.url === pathToFileURL(resolve(process.argv[1])).href

if (isCli) {
  const args = process.argv.slice(2)
  runSetupRelease({
    dryRun: args.includes('--dry-run'),
    skipPublish: args.includes('--no-publish'),
  })
}
