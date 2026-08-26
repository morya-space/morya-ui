import type { FormItemRule, FormValidateTrigger } from './types'

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

export async function evaluateFormRule(
  rule: FormItemRule,
  value: unknown,
  requiredFallback: string,
): Promise<string | undefined> {
  if (rule.required && isEmptyValue(value)) return rule.message?.trim() || requiredFallback

  const length = numericLength(value)
  if (rule.min != null && length != null && length < rule.min) {
    return rule.message?.trim() || requiredFallback
  }
  if (rule.max != null && length != null && length > rule.max) {
    return rule.message?.trim() || requiredFallback
  }
  if (rule.pattern && typeof value === 'string' && value !== '' && !rule.pattern.test(value)) {
    return rule.message?.trim() || requiredFallback
  }
  if (rule.validator) {
    const result = await rule.validator(value)
    if (typeof result === 'string' && result.trim()) return result.trim()
    if (result === false) return rule.message?.trim() || requiredFallback
  }
  return undefined
}

export function toCssSize(value?: string | number): string | undefined {
  if (value == null || value === '') return undefined
  return typeof value === 'number' ? `${value}px` : value
}
