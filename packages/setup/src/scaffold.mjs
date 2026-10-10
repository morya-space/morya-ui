import { execSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { canPrompt, selectOption } from './prompt.mjs'

/**
 * Valid npm package name (lowercase, no leading dot/underscore, no spaces).
 * Accepts scoped names like `@scope/pkg` and nested paths (`foo/bar`) by
 * validating only the last segment.
 * @param {string} name
 */
export function isValidProjectName(name) {
  if (!name || typeof name !== 'string') return false
  const segment = name.split('/').filter(Boolean).pop() || ''
  if (!segment) return false
  return /^[a-z0-9-~][a-z0-9-._~]*$/.test(segment)
}

/**
 * Validate a project name for interactive prompts.
 * @param {string} value
 * @returns {string | null} error message or null when valid
 */
export function projectNameError(value) {
  if (!value) return 'Project name is required.'
  if (!isValidProjectName(value)) {
    return 'Use lowercase letters, numbers, "-", "_", or "." (e.g. "my-admin").'
  }
  return null
}

/**
 * Resolve create-vite template. Prompts when interactive is allowed.
 * @param {{ template?: string, interactive?: boolean }} [options]
 * @returns {Promise<string>}
 */
export async function resolveViteTemplate({ template, interactive = false } = {}) {
  if (template) {
    const normalized = template.trim().toLowerCase()
    if (normalized === 'vue-ts' || normalized === 'ts' || normalized === 'typescript') return 'vue-ts'
    if (normalized === 'vue' || normalized === 'js' || normalized === 'javascript') return 'vue'
    throw new Error(`Unknown --template value: ${template}. Use "vue-ts" or "vue".`)
  }
  if (!interactive) return 'vue-ts'

  return selectOption('Select a create-vite template:', [
    { value: 'vue-ts', label: 'vue-ts', hint: 'Vue 3 + TypeScript (recommended)' },
    { value: 'vue', label: 'vue', hint: 'Vue 3 + JavaScript' },
  ], { default: 'vue-ts' })
}

/**
 * Scaffold a fresh Vite Vue app into `cwd` via create-vite, then run the
 * package manager install so the project is immediately usable.
 *
 * @param {string} parentDir directory that will contain the new project
 * @param {string} name project directory name
 * @param {{ pm: string, template?: string, dryRun?: boolean, interactive?: boolean }} options
 * @returns {Promise<{ cwd: string, command: string, installCommand: string, template: string, skipped?: boolean, reason?: string }>}
 */
export async function scaffoldProject(parentDir, name, { pm, template, dryRun = false, interactive = false } = {}) {
  if (!isValidProjectName(name)) {
    throw new Error(
      `Invalid project name: "${name}". Use lowercase letters, numbers, "-", "_", or "." (e.g. "my-admin").`,
    )
  }

  const cwd = resolve(parentDir, name)
  if (existsSync(cwd)) {
    const entries = readdirSync(cwd)
    if (entries.length) {
      throw new Error(`Directory "${name}" already exists and is not empty: ${cwd}`)
    }
  }

  const resolvedTemplate = await resolveViteTemplate({ template, interactive })
  const createCommand = buildCreateViteCommand(pm, name, resolvedTemplate)
  const installCommand = buildInstallCommand(pm)

  if (dryRun) {
    return { cwd, command: createCommand, installCommand, template: resolvedTemplate, skipped: true, reason: 'dry-run' }
  }

  console.log('Scaffolding project (create-vite):')
  console.log(`  $ ${createCommand}`)
  execSync(createCommand, { cwd: parentDir, stdio: 'inherit', shell: true })

  console.log('Installing dependencies:')
  console.log(`  $ ${installCommand}`)
  execSync(installCommand, { cwd, stdio: 'inherit', shell: true })

  return { cwd, command: createCommand, installCommand, template: resolvedTemplate }
}

/**
 * create-vite command per package manager. All variants accept the
 * `<name> --template <tpl>` shape and run non-interactively.
 * @param {string} pm
 * @param {string} name
 * @param {string} template
 */
export function buildCreateViteCommand(pm, name, template) {
  switch (pm) {
    case 'pnpm':
      return `pnpm create vite ${name} --template ${template}`
    case 'yarn':
      return `yarn create vite ${name} --template ${template}`
    case 'npm':
      return `npm create vite@latest ${name} -- --template ${template}`
    default:
      throw new Error(`Unknown package manager: ${pm}`)
  }
}

/**
 * @param {string} pm
 */
export function buildInstallCommand(pm) {
  switch (pm) {
    case 'pnpm':
      return 'pnpm install'
    case 'yarn':
      return 'yarn install'
    case 'npm':
      return 'npm install'
    default:
      throw new Error(`Unknown package manager: ${pm}`)
  }
}

/**
 * Whether we can prompt for scaffold-related options.
 * @param {{ yes?: boolean, dryRun?: boolean }} [options]
 */
export function scaffoldCanPrompt(options) {
  return canPrompt(options)
}
