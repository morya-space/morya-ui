import type { WkGapSize } from './gap'
import type { WkInputVariant, WkSizeInput } from './types'

export type WkShowPasswordOn = 'click' | 'mousedown'

export type WkTextareaAutosize = boolean | { minRows?: number; maxRows?: number }

/**
 * Per-component default props, keyed by unprefixed name (`Input`) or `Wk*` alias.
 * Only props that a component actually reads from config are listed; extra keys are ignored.
 */
export interface WkComponentDefaultMap {
  Input?: {
    size?: WkSizeInput
    variant?: WkInputVariant
    fluid?: boolean
    clearable?: boolean
    showCount?: boolean
  }
  InputPassword?: {
    size?: WkSizeInput
    variant?: WkInputVariant
    fluid?: boolean
    clearable?: boolean
    showCount?: boolean
    toggleMask?: boolean
    showPasswordOn?: WkShowPasswordOn
  }
  Textarea?: {
    size?: WkSizeInput
    variant?: WkInputVariant
    fluid?: boolean
    clearable?: boolean
    showCount?: boolean
    rows?: number
    autosize?: WkTextareaAutosize
  }
  Select?: {
    size?: WkSizeInput
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
    size?: WkSizeInput
  }
  Space?: {
    size?: WkGapSize
  }
  Flex?: {
    size?: WkGapSize
  }
  InputNumber?: { size?: WkSizeInput }
  DatePicker?: { size?: WkSizeInput }
  Table?: { size?: WkSizeInput }
  AutoComplete?: { size?: WkSizeInput }
  CascadeSelect?: { size?: WkSizeInput; fluid?: boolean; clearable?: boolean }
  TreeSelect?: { size?: WkSizeInput; clearable?: boolean }
  SplitButton?: { size?: WkSizeInput }
  SelectButton?: { size?: WkSizeInput }
  ToggleButton?: { size?: WkSizeInput }
}

export type WkComponentDefaults = WkComponentDefaultMap & {
  [name: string]: Record<string, unknown> | undefined
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function normalizeComponentDefaultName(name: string): string {
  if (name.startsWith('Wk')) return name.slice(2)
  return name
}

export function getComponentDefaults(
  defaults: WkComponentDefaults | undefined,
  name: string,
): Record<string, unknown> {
  if (!defaults) return {}
  const base = normalizeComponentDefaultName(name)
  const fromBase = defaults[base]
  const fromPrefixed = defaults[`Wk${base}`]
  return {
    ...(isPlainObject(fromBase) ? fromBase : {}),
    ...(isPlainObject(fromPrefixed) ? fromPrefixed : {}),
  }
}

export function getComponentDefault<T>(
  defaults: WkComponentDefaults | undefined,
  name: string,
  key: string,
): T | undefined {
  return getComponentDefaults(defaults, name)[key] as T | undefined
}

/** Deep-merge per component; child props win. */
export function mergeComponentDefaults(
  parent?: WkComponentDefaults,
  child?: WkComponentDefaults,
): WkComponentDefaults | undefined {
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
  return result as WkComponentDefaults
}
