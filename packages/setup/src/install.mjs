import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const LOCKFILES = [
  { pm: 'pnpm', file: 'pnpm-lock.yaml' },
  { pm: 'yarn', file: 'yarn.lock' },
  { pm: 'npm', file: 'package-lock.json' },
]

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

function installCommand(pm) {
  switch (pm) {
    case 'pnpm':
      return 'pnpm add morya-ui'
    case 'yarn':
      return 'yarn add morya-ui'
    case 'npm':
      return 'npm install morya-ui'
    default:
      throw new Error(`Unknown package manager: ${pm}`)
  }
}

/**
 * @returns {{ pm: string, command: string, skipped?: boolean, reason?: string }}
 */
export function installMoryaUi(cwd, { pm, dryRun = false, skipInstall = false } = {}) {
  const resolved = detectPackageManager(cwd, pm)
  const command = installCommand(resolved)

  if (skipInstall) {
    return { pm: resolved, command, skipped: true, reason: 'skip-install' }
  }

  if (!existsSync(join(cwd, 'package.json'))) {
    return {
      pm: resolved,
      command,
      skipped: true,
      reason: 'no-package-json',
    }
  }

  if (dryRun) {
    return { pm: resolved, command, skipped: true, reason: 'dry-run' }
  }

  execSync(command, { cwd, stdio: 'inherit', shell: true })
  return { pm: resolved, command }
}
