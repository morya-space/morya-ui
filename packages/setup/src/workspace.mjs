import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve, sep } from 'node:path'
import { readJson } from './fs-utils.mjs'
import { findEntryFile } from './styles.mjs'

const CORE_PACKAGE = 'morya-ui'
const SCOPE_PREFIX = '@morya-ui/'

/** Lockfiles used both to locate the workspace root and to detect the pm. */
const LOCKFILES = [
  { pm: 'pnpm', file: 'pnpm-lock.yaml' },
  { pm: 'yarn', file: 'yarn.lock' },
  { pm: 'npm', file: 'package-lock.json' },
]

/**
 * Whether a package.json declares a workspace. Covers:
 * - pnpm:    sibling pnpm-workspace.yaml
 * - npm/yarn: `workspaces` field (array or { packages: [] })
 * @param {string} dir directory containing package.json
 * @param {Record<string, unknown> | null} pkg parsed package.json
 */
export function declaresWorkspace(dir, pkg) {
  if (existsSync(join(dir, 'pnpm-workspace.yaml'))) return true
  if (pkg && typeof pkg === 'object') {
    const ws = pkg.workspaces
    if (Array.isArray(ws) && ws.length) return true
    if (ws && typeof ws === 'object' && Array.isArray(ws.packages) && ws.packages.length) return true
  }
  return false
}

function readPkgSafe(dir) {
  const path = join(dir, 'package.json')
  if (!existsSync(path)) return null
  try {
    return readJson(path)
  } catch {
    return null
  }
}

function hasLockfile(dir) {
  return LOCKFILES.some(({ file }) => existsSync(join(dir, file)))
}

/**
 * Walk up from `startDir` to the enclosing dependency/workspace root.
 *
 * The root is the nearest ancestor that either declares a workspace or has a
 * lockfile. In a monorepo that is the workspace root; in a plain single
 * package it is the package itself. Never ascends past the filesystem root.
 *
 * @param {string} startDir
 * @returns {{ root: string, isWorkspace: boolean }}
 */
export function findDependencyRoot(startDir) {
  let dir = resolve(startDir)
  for (;;) {
    const pkg = readPkgSafe(dir)
    if (declaresWorkspace(dir, pkg) || hasLockfile(dir)) {
      return { root: dir, isWorkspace: declaresWorkspace(dir, pkg) }
    }
    const parent = dirname(dir)
    if (parent === dir) return { root: resolve(startDir), isWorkspace: false }
    dir = parent
  }
}

/** Expand a workspace glob like `packages/*` into concrete member dirs. */
function expandGlob(root, pattern) {
  const clean = pattern.replace(/\\/g, '/').replace(/\/$/, '')
  const dirs = []
  if (clean.endsWith('/*')) {
    const base = join(root, clean.slice(0, -2))
    if (!existsSync(base)) return dirs
    for (const name of readdirSync(base)) {
      const full = join(base, name)
      if (existsSync(join(full, 'package.json'))) dirs.push(full)
    }
    return dirs
  }
  // Exact path (no wildcard) — e.g. `packages/app` or `.`
  const full = join(root, clean)
  if (clean && clean !== '.' && existsSync(join(full, 'package.json'))) dirs.push(full)
  return dirs
}

function readPnpmWorkspacePatterns(root) {
  const path = join(root, 'pnpm-workspace.yaml')
  if (!existsSync(path)) return []
  const text = readFileSync(path, 'utf8')
  const patterns = []
  let inPackages = false
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '')
    if (/^\s*packages\s*:/.test(line)) {
      inPackages = true
      continue
    }
    if (inPackages) {
      // Stop when a new top-level key starts (e.g. `trustPolicy:`).
      if (/^\S[^:]*\s*:/.test(line)) break
      const m = line.match(/^\s*-\s*['"]?([^'"]+)['"]?\s*$/)
      if (m) patterns.push(m[1].trim())
    }
  }
  return patterns
}

function readWorkspacesFieldPatterns(root, pkg) {
  const ws = pkg?.workspaces
  if (Array.isArray(ws)) return ws.filter((p) => typeof p === 'string')
  if (ws && typeof ws === 'object' && Array.isArray(ws.packages)) {
    return ws.packages.filter((p) => typeof p === 'string')
  }
  return []
}

/**
 * List workspace member directories (each containing a package.json).
 * Supports pnpm (`pnpm-workspace.yaml`) and npm/yarn (`workspaces` field).
 * Excludes the root itself; ignores negated (`!`) globs and `node_modules`.
 *
 * @param {string} root workspace root
 * @param {Record<string, unknown> | null} rootPkg
 * @returns {string[]} absolute member dirs
 */
export function listWorkspaceMembers(root, rootPkg) {
  const pnpmPatterns = readPnpmWorkspacePatterns(root)
  const patterns = pnpmPatterns.length ? pnpmPatterns : readWorkspacesFieldPatterns(root, rootPkg)
  const members = new Set()
  for (const pattern of patterns) {
    if (!pattern || pattern.startsWith('!')) continue
    for (const dir of expandGlob(root, pattern)) {
      if (dir.includes(`node_modules${sep}`) || dir.endsWith(`${sep}node_modules`)) continue
      members.add(dir)
    }
  }
  members.delete(root)
  return [...members]
}

function packageDeclaresMorya(pkg) {
  if (!pkg || typeof pkg !== 'object') return false
  for (const field of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
    const deps = pkg[field]
    if (!deps || typeof deps !== 'object') continue
    for (const name of Object.keys(deps)) {
      if (name === CORE_PACKAGE || name.startsWith(SCOPE_PREFIX)) return true
    }
  }
  return false
}

/**
 * Rank a member as an install target. Higher wins:
 * - already depends on morya-ui / @morya-ui/*  → 2
 * - has an app entry file (findEntryFile)       → 1
 * - otherwise                                   → 0
 */
function rankMember(dir) {
  const pkg = readPkgSafe(dir)
  let score = 0
  if (packageDeclaresMorya(pkg)) score += 2
  if (findEntryFile(dir)) score += 1
  return score
}

/**
 * Resolve where dependencies should be installed and styles injected (the
 * "app package") versus where the AI pack / MCP / scripts belong (the
 * "config root").
 *
 * @param {string} cwd directory the user invoked the CLI from
 * @returns {{
 *   cwd: string,
 *   configRoot: string,
 *   installRoot: string,
 *   isWorkspace: boolean,
 *   workspaceRoot: string | null,
 *   appPackage: string | null,
 * }}
 */
export function resolveSetupContext(cwd) {
  const start = resolve(cwd)
  const { root, isWorkspace } = findDependencyRoot(start)

  // Not a workspace: config and install target are the same directory.
  if (!isWorkspace) {
    return {
      cwd: start,
      configRoot: root,
      installRoot: root,
      isWorkspace: false,
      workspaceRoot: null,
      appPackage: null,
    }
  }

  const rootPkg = readPkgSafe(root)

  // Invoked from the workspace root: config lands at root; install target is
  // picked among members (morya consumers first, then entry-bearing apps).
  if (start === root) {
    const members = listWorkspaceMembers(root, rootPkg)
    let best = null
    let bestScore = -1
    for (const dir of members) {
      const score = rankMember(dir)
      if (score > bestScore) {
        best = dir
        bestScore = score
      }
    }
    const installRoot = bestScore > 0 && best ? best : null
    return {
      cwd: start,
      configRoot: root,
      installRoot: installRoot ?? root,
      isWorkspace: true,
      workspaceRoot: root,
      appPackage: installRoot,
    }
  }

  // Invoked from inside a member package: that member is the app target;
  // config still lands at the workspace root (where the editor is opened).
  return {
    cwd: start,
    configRoot: root,
    installRoot: start,
    isWorkspace: true,
    workspaceRoot: root,
    appPackage: start,
  }
}
