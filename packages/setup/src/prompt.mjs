import { createInterface } from 'node:readline'
import { checkbox, input, confirm as inquirerConfirm, select } from '@inquirer/prompts'

/**
 * Whether we can prompt the user (TTY stdin + not suppressed).
 * @param {{ yes?: boolean, dryRun?: boolean }} [options]
 */
export function canPrompt({ yes = false, dryRun = false } = {}) {
  return Boolean(process.stdin.isTTY) && !yes && !dryRun
}

/**
 * Single-line question (fallback for non-TTY environments).
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export function question(prompt) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

function exitOnAbort(error) {
  if (error?.code === 'ABORT_ERR' || error?.name === 'AbortError') {
    console.log('\nCancelled')
    process.exit(130)
  }
  throw error
}

/**
 * Multi-select with arrow keys and space to toggle.
 *
 * @param {string} title heading shown above the options
 * @param {Array<{ value: string, label: string, hint?: string, checked?: boolean }>} options
 * @param {{ required?: string[] }} [config] values that are always included
 * @returns {Promise<string[]>}
 */
export async function multiSelect(title, options, { required = [] } = {}) {
  if (!options.length) return required

  const choices = options.map((entry) => ({
    value: entry.value,
    name: entry.label,
    description: entry.hint,
    checked: entry.checked ?? required.includes(entry.value),
    disabled: required.includes(entry.value) ? 'required' : undefined,
  }))

  try {
    const selected = await checkbox({
      message: title,
      choices,
      pageSize: 15,
      instructions: false,
    })
    // Ensure required values are always in the result even if Inquirer omits disabled ones
    return [...new Set([...required, ...selected])]
  } catch (error) {
    exitOnAbort(error)
  }
}

/**
 * Single-select with arrow keys.
 *
 * @param {string} title heading shown above the options
 * @param {Array<{ value: string, label: string, hint?: string }>} options
 * @param {{ default?: string, allowEmpty?: boolean }} [config]
 * @returns {Promise<string>}
 */
export async function selectOption(title, options, { default: defaultValue, allowEmpty = true } = {}) {
  if (!options.length) throw new Error('selectOption requires at least one option')

  const choices = options.map((entry) => ({
    value: entry.value,
    name: entry.label,
    description: entry.hint,
  }))

  try {
    return await select({
      message: title,
      choices,
      default: defaultValue,
    })
  } catch (error) {
    exitOnAbort(error)
  }
}

/**
 * Confirm (y/N) prompt. Defaults to `defaultValue` on empty input.
 *
 * @param {string} prompt
 * @param {{ default?: boolean }} [config]
 * @returns {Promise<boolean>}
 */
export async function confirm(prompt, { default: defaultValue = false } = {}) {
  try {
    return await inquirerConfirm({
      message: prompt,
      default: defaultValue,
    })
  } catch (error) {
    exitOnAbort(error)
  }
}

/**
 * Free-form text prompt with optional default and validation.
 *
 * @param {string} prompt
 * @param {{ default?: string, validate?: (value: string) => string | null }} [config]
 * @returns {Promise<string>}
 */
export async function textInput(prompt, { default: defaultValue, validate } = {}) {
  try {
    return await input({
      message: prompt,
      default: defaultValue,
      validate: (value) => {
        if (!value && defaultValue == null) return 'A value is required.'
        if (validate) {
          const error = validate(value || defaultValue || '')
          if (error) return error
        }
        return true
      },
    })
  } catch (error) {
    exitOnAbort(error)
  }
}
