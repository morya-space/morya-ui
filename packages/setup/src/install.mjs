import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { readJson, writeJson } from './fs-utils.mjs'

const LOCKFILES = [
  { pm: 'pnpm', file: 'pnpm-lock.yaml' },
  { pm: 'yarn', file: 'yarn.lock' },
  { pm: 'npm', file: 'package-lock.json' },
]

const CORE_PACKAGE = 'morya-ui'
const SCOPE_PREFIX = '@morya-ui/'

export function detectPackageManager(cwd, explicit) {
  if (explicit) {
    if (!['pnpm', 'yarn', 'npm'].includes(explicit)) {
      throw new Error(`Unsupported --pm value: ${explicit}. Use pnpm, yarn, or npm.`)
    }
    return explicit
  }
  // Walk up so a workspace member (no own lockfile) resolves to the pm of the
  // workspace root lockfile instead of falling back to pnpm.
  let dir = resolve(cwd)
  for (;;) {
    for (const { pm, file } of LOCKFILES) {
      if (existsSync(join(dir, file))) return pm
    }
    const parent = dirname(dir)
    if (parent === dir) return 'pnpm'
    dir = parent
  }
}

/**
 * Collect morya-ui / @morya-ui/* names from package.json.
 * Always includes `morya-ui` when ensureCore is true (full / app).
 * @param {Record<string, unknown> | null} pkg
 * @param {{ ensureCore?: boolean }} [opts]
 * @returns {string[]}
 */
export function collectMoryaPackages(pkg, { ensureCore = true } = {}) {
  const names = new Set()
  if (pkg && typeof pkg === 'object') {
    for (const field of ['dependencies', 'devDependencies', 'optionalDependencies']) {
      const deps = pkg[field]
      if (!deps || typeof deps !== 'object') continue
      for (const name of Object.keys(deps)) {
        if (name === CORE_PACKAGE || name.startsWith(SCOPE_PREFIX)) {
          names.add(name)
        }
      }
    }
  }
  if (ensureCore) names.add(CORE_PACKAGE)
  return [...names].sort()
}

/**
 * @param {string} pm
 * @param {string[]} packages bare package names
 */
export function installCommand(pm, packages) {
  const specs = packages.map((name) => `${name}@latest`)
  const joined = specs.join(' ')
  switch (pm) {
    case 'pnpm':
      return `pnpm add ${joined}`
    case 'yarn':
      return `yarn add ${joined}`
    case 'npm':
      return `npm install ${joined}`
    default:
      throw new Error(`Unknown package manager: ${pm}`)
  }
}

/**
 * Install / upgrade `morya-ui` and any existing `@morya-ui/*` deps to the npm `latest` tag.
 *
 * In a pnpm workspace, `pnpm add` inside a member only *upgrades* an already
 * declared dependency (it does not append a new one). When `seedIfMissing` is
 * true and the target package.json declares no morya packages yet, we first
 * write `morya-ui: latest` into `dependencies` so the add works as an install.
 *
 * @returns {{
 *   pm: string,
 *   command: string,
 *   packages: string[],
 *   skipped?: boolean,
 *   reason?: string,
 *   seeded?: boolean,
 * }}
 */
export function installMoryaUi(cwd, {
  pm,
  dryRun = false,
  skipInstall = false,
  ensureCore = true,
  seedIfMissing = false,
} = {}) {
  const resolved = detectPackageManager(cwd, pm)
  const pkgPath = join(cwd, 'package.json')

  let pkg = null
  if (existsSync(pkgPath)) {
    try {
      pkg = readJson(pkgPath)
    } catch {
      pkg = null
    }
  }

  const packages = collectMoryaPackages(pkg, { ensureCore })
  const command = packages.length
    ? installCommand(resolved, packages)
    : installCommand(resolved, [CORE_PACKAGE])

  const base = { pm: resolved, command, packages }

  if (skipInstall) {
    return { ...base, skipped: true, reason: 'skip-install' }
  }

  if (!existsSync(pkgPath)) {
    return { ...base, skipped: true, reason: 'no-package-json' }
  }

  if (!packages.length) {
    return { ...base, skipped: true, reason: 'no-morya-packages' }
  }

  // Seed `morya-ui: latest` when the package declares no morya deps yet, so
  // the install command actually adds it (pnpm workspace members need this).
  const declaresAny = pkg ? collectMoryaPackages(pkg, { ensureCore: false }).length > 0 : false
  let seeded = false
  if (seedIfMissing && !declaresAny && pkg) {
    if (!dryRun) {
      pkg.dependencies = { ...(pkg.dependencies || {}), [CORE_PACKAGE]: 'latest' }
      writeJson(pkgPath, pkg)
    }
    seeded = true
  }

  if (dryRun) {
    return { ...base, skipped: true, reason: 'dry-run', seeded }
  }

  execSync(command, { cwd, stdio: 'inherit', shell: true })
  return { ...base, seeded }
}
