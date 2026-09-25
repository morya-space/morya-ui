import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'
import { readJson } from './fs-utils.mjs'

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
  for (const { pm, file } of LOCKFILES) {
    if (existsSync(join(cwd, file))) return pm
  }
  return 'pnpm'
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
 * @returns {{
 *   pm: string,
 *   command: string,
 *   packages: string[],
 *   skipped?: boolean,
 *   reason?: string,
 * }}
 */
export function installMoryaUi(cwd, {
  pm,
  dryRun = false,
  skipInstall = false,
  ensureCore = true,
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

  if (skipInstall) {
    return { pm: resolved, command, packages, skipped: true, reason: 'skip-install' }
  }

  if (!existsSync(pkgPath)) {
    return {
      pm: resolved,
      command,
      packages,
      skipped: true,
      reason: 'no-package-json',
    }
  }

  if (!packages.length) {
    return {
      pm: resolved,
      command,
      packages,
      skipped: true,
      reason: 'no-morya-packages',
    }
  }

  if (dryRun) {
    return { pm: resolved, command, packages, skipped: true, reason: 'dry-run' }
  }

  execSync(command, { cwd, stdio: 'inherit', shell: true })
  return { pm: resolved, command, packages }
}
