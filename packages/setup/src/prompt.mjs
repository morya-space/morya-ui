import { createInterface } from 'node:readline'

/**
 * Whether we can prompt the user (TTY stdin + not suppressed).
 * @param {{ yes?: boolean, dryRun?: boolean }} [options]
 */
export function canPrompt({ yes = false, dryRun = false } = {}) {
  return Boolean(process.stdin.isTTY) && !yes && !dryRun
}

/**
 * Single-line question.
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
 * Numbered list prompt. Returns the chosen value.
 *
 * @param {string} title heading shown above the options
 * @param {Array<{ value: string, label: string, hint?: string }>} options
 * @param {{ default?: string, allowEmpty?: boolean }} [config]
 * @returns {Promise<string>}
 */
export async function selectOption(title, options, { default: defaultValue, allowEmpty = true } = {}) {
  if (!options.length) throw new Error('selectOption requires at least one option')
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
 * Confirm (y/N) prompt. Defaults to `defaultValue` on empty input.
 *
 * @param {string} prompt
 * @param {{ default?: boolean }} [config]
 * @returns {Promise<boolean>}
 */
export async function confirm(prompt, { default: defaultValue = false } = {}) {
  const suffix = defaultValue ? ' [Y/n] ' : ' [y/N] '
  const answer = (await question(`${prompt}${suffix}`)).trim().toLowerCase()
  if (!answer) return defaultValue
  return answer === 'y' || answer === 'yes'
}

/**
 * Free-form text prompt with optional default.
 *
 * @param {string} prompt
 * @param {{ default?: string, validate?: (value: string) => string | null }} [config]
 * @returns {Promise<string>}
 */
export async function textInput(prompt, { default: defaultValue, validate } = {}) {
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
