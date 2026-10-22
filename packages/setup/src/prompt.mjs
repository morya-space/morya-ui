import { createInterface } from 'node:readline'

/**
 * Whether we can prompt the user (TTY stdin + not suppressed).
 * @param {{ yes?: boolean, dryRun?: boolean }} [options]
 */
export function canPrompt({ yes = false, dryRun = false } = {}) {
  return Boolean(process.stdin.isTTY) && !yes && !dryRun
}

/**
 * Single-line question (fallback for non-interactive or simple cases).
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

/**
 * Single-select with arrow keys and highlighting.
 * Falls back to numbered list when not in a TTY.
 *
 * @param {string} title heading shown above the options
 * @param {Array<{ value: string, label: string, hint?: string }>} options
 * @param {{ default?: string, allowEmpty?: boolean }} [config]
 * @returns {Promise<string>}
 */
export async function selectOption(title, options, { default: defaultValue, allowEmpty = true } = {}) {
  if (!options.length) throw new Error('selectOption requires at least one option')

  // Use @inquirer/prompts when interactive (TTY)
  if (process.stdin.isTTY) {
    const { select } = await import('@inquirer/prompts')
    const choices = options.map((opt) => ({
      value: opt.value,
      name: opt.label,
      description: opt.hint,
    }))
    return select({
      message: title,
      choices,
      default: defaultValue,
    })
  }

  // Fallback: numbered list for non-TTY
  console.log(title)
  options.forEach((entry, index) => {
    const mark = entry.value === defaultValue ? 'x' : ' '
    const hint = entry.hint ? ` — ${entry.hint}` : ''
    console.log(`  ${index + 1}. [${mark}] ${entry.label}${hint}`)
  })
  console.log('')
  const answer = (await question('> ')).trim()

  if (!answer) {
    if (defaultValue != null) return defaultValue
    if (allowEmpty) return ''
    throw new Error('A selection is required.')
  }

  const asIndex = Number(answer)
  if (Number.isInteger(asIndex) && asIndex >= 1 && asIndex <= options.length) {
    return options[asIndex - 1].value
  }

  const byValue = options.find(
    (entry) => entry.value === answer || entry.label.toLowerCase() === answer.toLowerCase(),
  )
  if (byValue) return byValue.value

  throw new Error(`Unknown selection: ${answer}`)
}

/**
 * Multi-select with space to toggle, arrow keys to navigate.
 * Falls back to comma-separated input when not in a TTY.
 *
 * @param {string} title heading shown above the options
 * @param {Array<{ value: string, label: string, hint?: string, checked?: boolean }>} options
 * @param {{ required?: string[] }} [config]
 * @returns {Promise<string[]>}
 */
export async function multiSelect(title, options, { required = [] } = {}) {
  if (!options.length) return []

  // Use @inquirer/prompts when interactive (TTY)
  if (process.stdin.isTTY) {
    const { checkbox } = await import('@inquirer/prompts')
    const choices = options.map((opt) => ({
      value: opt.value,
      name: opt.label,
      description: opt.hint,
      checked: opt.checked ?? required.includes(opt.value),
    }))
    const selected = await checkbox({
      message: title,
      choices,
    })
    // Ensure required items are always included
    return [...new Set([...required, ...selected])]
  }

  // Fallback: comma-separated input for non-TTY
  console.log(title)
  options.forEach((entry, index) => {
    const mark = (entry.checked ?? required.includes(entry.value)) ? 'x' : ' '
    const hint = entry.hint ? ` — ${entry.hint}` : ''
    console.log(`  ${index + 1}. [${mark}] ${entry.label}${hint}`)
  })
  console.log('')
  console.log('Enter comma-separated numbers or ids (empty = defaults only).')
  const answer = (await question('> ')).trim()

  if (!answer) {
    return required
  }

  const selected = new Set(required)
  const tokens = answer.split(/[\s,]+/).filter(Boolean)
  for (const token of tokens) {
    const asIndex = Number(token)
    if (Number.isInteger(asIndex) && asIndex >= 1 && asIndex <= options.length) {
      selected.add(options[asIndex - 1].value)
      continue
    }
    if (token === 'all') {
      for (const opt of options) selected.add(opt.value)
      continue
    }
    if (!options.some((o) => o.value === token)) {
      throw new Error(`Unknown selection: ${token}`)
    }
    selected.add(token)
  }
  return [...selected]
}

/**
 * Confirm (y/N) prompt with arrow keys.
 * Falls back to text input when not in a TTY.
 *
 * @param {string} prompt
 * @param {{ default?: boolean }} [config]
 * @returns {Promise<boolean>}
 */
export async function confirm(prompt, { default: defaultValue = false } = {}) {
  if (process.stdin.isTTY) {
    const { confirm: inquirerConfirm } = await import('@inquirer/prompts')
    return inquirerConfirm({
      message: prompt,
      default: defaultValue,
    })
  }

  // Fallback
  const suffix = defaultValue ? ' [Y/n] ' : ' [y/N] '
  const answer = (await question(`${prompt}${suffix}`)).trim().toLowerCase()
  if (!answer) return defaultValue
  return answer === 'y' || answer === 'yes'
}

/**
 * Free-form text prompt with optional default and validation.
 * Falls back to simple input when not in a TTY.
 *
 * @param {string} prompt
 * @param {{ default?: string, validate?: (value: string) => string | null }} [config]
 * @returns {Promise<string>}
 */
export async function textInput(prompt, { default: defaultValue, validate } = {}) {
  if (process.stdin.isTTY) {
    const { input } = await import('@inquirer/prompts')
    return input({
      message: prompt,
      default: defaultValue,
      validate: validate
        ? (value) => {
            const error = validate(value)
            return error === null ? true : error
          }
        : undefined,
    })
  }

  // Fallback
  const suffix = defaultValue != null ? ` (${defaultValue})` : ''
  for (;;) {
    const answer = (await question(`${prompt}${suffix}: `)).trim()
    const value = answer || defaultValue || ''
    if (!value) return ''
    if (validate) {
      const error = validate(value)
      if (error) {
        console.log(`  ✗ ${error}`)
        continue
      }
    }
    return value
  }
}
