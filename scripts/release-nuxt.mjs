import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { run } from './release-steps.mjs'
import { root } from './ui-changelog.mjs'

export const NUXT_NAME = '@roost-design/nuxt'
export const NUXT_PKG_PATH = join(root, 'packages/nuxt/package.json')
export const NUXT_RELEASE_PATHS = ['packages/nuxt/package.json']

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

/** Align @roost-design/nuxt version and peer range with @roost-design/ui. */
export function syncNuxtVersion(version = readUiVersion().version) {
  const nuxtPkg = readJson(NUXT_PKG_PATH)
  let changed = false

  if (nuxtPkg.version !== version) {
    nuxtPkg.version = version
    changed = true
  }

  const peer = nuxtPkg.peerDependencies?.['@roost-design/ui']
  const nextPeer = `^${version}`
  if (peer !== nextPeer) {
    nuxtPkg.peerDependencies = {
      ...nuxtPkg.peerDependencies,
      '@roost-design/ui': nextPeer,
    }
    changed = true
  }

  if (!changed) {
    console.log(`${NUXT_NAME} already at v${version}`)
    return false
  }

  writeJson(NUXT_PKG_PATH, nuxtPkg)
  console.log(`Updated ${NUXT_NAME} package.json to v${version}`)
  return true
}

export function buildNuxt() {
  console.log('[build] @roost-design/nuxt')
  run('pnpm --filter @roost-design/nuxt build')
}

export function publishNuxt() {
  console.log('[publish] @roost-design/nuxt')
  run('pnpm --filter @roost-design/nuxt publish --access public --no-git-checks')
}

const isCli =
  Boolean(process.argv[1]) && import.meta.url === pathToFileURL(resolve(process.argv[1])).href

if (isCli) {
  const { version } = readUiVersion()
  syncNuxtVersion(version)
  buildNuxt()
  publishNuxt()
  console.log(`Released ${NUXT_NAME} v${version}`)
}
