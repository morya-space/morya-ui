import type { FormItemRule, FormRuleType, FormValidateTrigger } from './types'

export function normalizeFormRules(rules?: FormItemRule | FormItemRule[]): FormItemRule[] {
  if (!rules) return []
  return Array.isArray(rules) ? rules : [rules]
}

export function normalizeTriggers(
  trigger: FormValidateTrigger | FormValidateTrigger[],
): FormValidateTrigger[] {
  return Array.isArray(trigger) ? trigger : [trigger]
}

export function ruleMatchesTrigger(
  rule: FormItemRule,
  trigger: FormValidateTrigger | 'all',
  formValidateOn: FormValidateTrigger[],
): boolean {
  if (trigger === 'all' || trigger === 'submit') return true
  const ruleTriggers = rule.trigger == null ? formValidateOn : normalizeTriggers(rule.trigger)
  return ruleTriggers.includes(trigger)
}

export function isEmptyValue(value: unknown): boolean {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}

function numericLength(value: unknown): number | undefined {
  if (typeof value === 'string' || Array.isArray(value)) return value.length
  if (typeof value === 'number' && Number.isFinite(value)) return value
  return undefined
}

/* —— Built-in type checks —— */

const EMAIL_PATTERN = /^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/
const URL_PATTERN = /^(https?|ftp):\/\/[^\s/$.?#][^\s]*$/i

function checkRuleType(type: FormRuleType, value: unknown): 'email' | 'url' | 'date' | 'value' | undefined {
  switch (type) {
    case 'string':
      return typeof value === 'string' ? undefined : 'value'
    case 'number':
      return typeof value === 'number' && Number.isFinite(value) ? undefined : 'value'
    case 'integer':
      return typeof value === 'number' && Number.isInteger(value) ? undefined : 'value'
    case 'boolean':
      return typeof value === 'boolean' ? undefined : 'value'
    case 'array':
      return Array.isArray(value) ? undefined : 'value'
    case 'object':
      return isPlainObject(value) ? undefined : 'value'
    case 'email':
      return typeof value === 'string' && EMAIL_PATTERN.test(value) ? undefined : 'email'
    case 'url':
      return typeof value === 'string' && URL_PATTERN.test(value) ? undefined : 'url'
    case 'date':
      return value instanceof Date && !Number.isNaN(value.getTime()) ? undefined : 'date'
    default:
      return undefined
  }
}

function isPlainObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)
}

/** Messages injected into rule evaluation (locale-aware, with plain-string fallback). */
export interface FormRuleMessages {
  required: string
  invalidValue: string
  invalidEmail: string
  invalidUrl: string
  invalidDate: string
}

/** Accept a bare required message so callers can skip the full message set. */
export function resolveRuleMessages(input: FormRuleMessages | string): FormRuleMessages {
  if (typeof input !== 'string') return input
  return {
    required: input,
    invalidValue: input,
    invalidEmail: input,
    invalidUrl: input,
    invalidDate: input,
  }
}

function typeMessage(
  kind: 'email' | 'url' | 'date' | 'value',
  messages: FormRuleMessages,
): string {
  if (kind === 'email') return messages.invalidEmail
  if (kind === 'url') return messages.invalidUrl
  if (kind === 'date') return messages.invalidDate
  return messages.invalidValue
}

export async function evaluateFormRule(
  rule: FormItemRule,
  rawValue: unknown,
  messageInput: FormRuleMessages | string,
): Promise<string | undefined> {
  const messages = resolveRuleMessages(messageInput)
  const value = rule.transform ? rule.transform(rawValue) : rawValue

  // Required runs first so an empty field reports "required" rather than a type mismatch.
  if (rule.required) {
    const empty = rule.whitespace === false
      ? value == null || value === '' || (Array.isArray(value) && value.length === 0)
      : isEmptyValue(value)
    if (empty) return rule.message?.trim() || messages.required
  }

  // Type checks are skipped for empty values (required already covered that case).
  if (rule.type != null && !isEmptyValue(value)) {
    const kind = checkRuleType(rule.type, value)
    if (kind) return rule.message?.trim() || typeMessage(kind, messages)
  }

  const length = numericLength(value)
  if (rule.len != null && length != null && length !== rule.len) {
    return rule.message?.trim() || messages.invalidValue
  }
  if (rule.min != null && length != null && length < rule.min) {
    return rule.message?.trim() || messages.required
  }
  if (rule.max != null && length != null && length > rule.max) {
    return rule.message?.trim() || messages.required
  }
  if (rule.enum && !rule.enum.includes(value)) {
    return rule.message?.trim() || messages.invalidValue
  }
  if (rule.pattern && typeof value === 'string' && value !== '' && !rule.pattern.test(value)) {
    return rule.message?.trim() || messages.required
  }
  if (rule.validator) {
    const result = await rule.validator(value)
    if (typeof result === 'string' && result.trim()) return result.trim()
    if (result === false) return rule.message?.trim() || messages.required
  }
  return undefined
}

export function toCssSize(value?: string | number): string | undefined {
  if (value == null || value === '') return undefined
  return typeof value === 'number' ? `${value}px` : value
}
