import type { MGapSize } from './gap'
import type { MInputVariant, MSizeInput } from './types'

export type MShowPasswordOn = 'click' | 'mousedown'

export type MTextareaAutosize = boolean | { minRows?: number; maxRows?: number }

/**
 * Per-component default props, keyed by unprefixed name (`Input`) or `M*` alias.
 * Only props that a component actually reads from config are listed; extra keys are ignored.
 */
export interface MComponentDefaultMap {
  Input?: {
    size?: MSizeInput
    variant?: MInputVariant
    fluid?: boolean
    clearable?: boolean
    showCount?: boolean
  }
  InputPassword?: {
    size?: MSizeInput
    variant?: MInputVariant
    fluid?: boolean
    clearable?: boolean
    showCount?: boolean
    toggleMask?: boolean
    showPasswordOn?: MShowPasswordOn
  }
  Textarea?: {
    size?: MSizeInput
    variant?: MInputVariant
    fluid?: boolean
    clearable?: boolean
    showCount?: boolean
    rows?: number
    autosize?: MTextareaAutosize
  }
  Select?: {
    size?: MSizeInput
    fluid?: boolean
    /** @deprecated Prefer `clearable`. */
    showClear?: boolean
    clearable?: boolean
    filter?: boolean
    multiple?: boolean
    tag?: boolean
    remote?: boolean
  }
  Button?: {
    size?: MSizeInput
  }
  Space?: {
    size?: MGapSize
  }
  Flex?: {
    size?: MGapSize
  }
  InputNumber?: { size?: MSizeInput }
  DatePicker?: { size?: MSizeInput }
  Table?: { size?: MSizeInput }
  AutoComplete?: { size?: MSizeInput }
  CascadeSelect?: { size?: MSizeInput; fluid?: boolean; clearable?: boolean }
  TreeSelect?: { size?: MSizeInput; clearable?: boolean }
  SplitButton?: { size?: MSizeInput }
  SelectButton?: { size?: MSizeInput }
  ToggleButton?: { size?: MSizeInput }
}

export type MComponentDefaults = MComponentDefaultMap & {
  [name: string]: Record<string, unknown> | undefined
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function normalizeComponentDefaultName(name: string): string {
  if (/^M[A-Z]/.test(name)) return name.slice(1)
  return name
}

export function getComponentDefaults(
  defaults: MComponentDefaults | undefined,
  name: string,
): Record<string, unknown> {
  if (!defaults) return {}
  const base = normalizeComponentDefaultName(name)
  const fromBase = defaults[base]
  const fromPrefixed = defaults[`M${base}`]
  return {
    ...(isPlainObject(fromBase) ? fromBase : {}),
    ...(isPlainObject(fromPrefixed) ? fromPrefixed : {}),
  }
}

export function getComponentDefault<T>(
  defaults: MComponentDefaults | undefined,
  name: string,
  key: string,
): T | undefined {
  return getComponentDefaults(defaults, name)[key] as T | undefined
}

/** Deep-merge per component; child props win. */
export function mergeComponentDefaults(
  parent?: MComponentDefaults,
  child?: MComponentDefaults,
): MComponentDefaults | undefined {
  if (!parent && !child) return undefined
  if (!parent) return child
  if (!child) return parent
  const keys = new Set([...Object.keys(parent), ...Object.keys(child)])
  const result: Record<string, unknown> = {}
  for (const key of keys) {
    const parentValue = parent[key]
    const childValue = child[key]
    if (isPlainObject(parentValue) && isPlainObject(childValue)) {
      result[key] = { ...parentValue, ...childValue }
    } else {
      result[key] = childValue ?? parentValue
    }
  }
  return result as MComponentDefaults
}
