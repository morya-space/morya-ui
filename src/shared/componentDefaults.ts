import type { WiGapSize } from './gap'
import type { WiInputVariant, WiSizeInput } from './types'

export type WiShowPasswordOn = 'click' | 'mousedown'

export type WiTextareaAutosize = boolean | { minRows?: number; maxRows?: number }

/**
 * Per-component default props, keyed by unprefixed name (`Input`) or `Wi*` alias.
 * Only props that a component actually reads from config are listed; extra keys are ignored.
 */
export interface WiComponentDefaultMap {
  Input?: {
    size?: WiSizeInput
    variant?: WiInputVariant
    fluid?: boolean
    clearable?: boolean
    showCount?: boolean
  }
  InputPassword?: {
    size?: WiSizeInput
    variant?: WiInputVariant
    fluid?: boolean
    clearable?: boolean
    showCount?: boolean
    toggleMask?: boolean
    showPasswordOn?: WiShowPasswordOn
  }
  Textarea?: {
    size?: WiSizeInput
    variant?: WiInputVariant
    fluid?: boolean
    clearable?: boolean
    showCount?: boolean
    rows?: number
    autosize?: WiTextareaAutosize
  }
  Select?: {
    size?: WiSizeInput
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
    size?: WiSizeInput
  }
  Space?: {
    size?: WiGapSize
  }
  Flex?: {
    size?: WiGapSize
  }
  InputNumber?: { size?: WiSizeInput }
  DatePicker?: { size?: WiSizeInput }
  Table?: { size?: WiSizeInput }
  AutoComplete?: { size?: WiSizeInput }
  CascadeSelect?: { size?: WiSizeInput; fluid?: boolean; clearable?: boolean }
  TreeSelect?: { size?: WiSizeInput; clearable?: boolean }
  SplitButton?: { size?: WiSizeInput }
  SelectButton?: { size?: WiSizeInput }
  ToggleButton?: { size?: WiSizeInput }
}

export type WiComponentDefaults = WiComponentDefaultMap & {
  [name: string]: Record<string, unknown> | undefined
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function normalizeComponentDefaultName(name: string): string {
  return name.startsWith('Wi') ? name.slice(2) : name
}

export function getComponentDefaults(
  defaults: WiComponentDefaults | undefined,
  name: string,
): Record<string, unknown> {
  if (!defaults) return {}
  const base = normalizeComponentDefaultName(name)
  const fromBase = defaults[base]
  const fromPrefixed = defaults[`Wi${base}`]
  return {
    ...(isPlainObject(fromBase) ? fromBase : {}),
    ...(isPlainObject(fromPrefixed) ? fromPrefixed : {}),
  }
}

export function getComponentDefault<T>(
  defaults: WiComponentDefaults | undefined,
  name: string,
  key: string,
): T | undefined {
  return getComponentDefaults(defaults, name)[key] as T | undefined
}

/** Deep-merge per component; child props win. */
export function mergeComponentDefaults(
  parent?: WiComponentDefaults,
  child?: WiComponentDefaults,
): WiComponentDefaults | undefined {
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
  return result as WiComponentDefaults
}
