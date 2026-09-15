import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { readJson, writeJson } from './fs-utils.mjs'

const CHECK_COLORS = 'node scripts/check-raw-colors.mjs'

/**
 * @returns {{ action: 'added' | 'skipped' | 'missing-package-json', dryRun?: boolean }}
 */
export function ensureCheckColorsScript(cwd, { force = false, dryRun = false } = {}) {
  const path = join(cwd, 'package.json')
  if (!existsSync(path)) {
    return { action: 'missing-package-json' }
  }

  const pkg = readJson(path)
  pkg.scripts = pkg.scripts || {}

  if (pkg.scripts['check:colors'] && !force) {
    return { action: 'skipped' }
  }

  pkg.scripts['check:colors'] = CHECK_COLORS

  if (!dryRun) {
    writeJson(path, pkg)
  }

  return { action: 'added', dryRun }
}
