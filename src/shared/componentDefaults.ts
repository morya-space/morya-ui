import type { WdGapSize } from './gap'
import type { WdInputVariant, WdSizeInput } from './types'

export type WdShowPasswordOn = 'click' | 'mousedown'

export type WdTextareaAutosize = boolean | { minRows?: number; maxRows?: number }

/**
 * Per-component default props, keyed by unprefixed name (`Input`) or `Wd*` alias.
 * Only props that a component actually reads from config are listed; extra keys are ignored.
 */
export interface WdComponentDefaultMap {
  Input?: {
    size?: WdSizeInput
    variant?: WdInputVariant
    fluid?: boolean
    clearable?: boolean
    showCount?: boolean
  }
  InputPassword?: {
    size?: WdSizeInput
    variant?: WdInputVariant
    fluid?: boolean
    clearable?: boolean
    showCount?: boolean
    toggleMask?: boolean
    showPasswordOn?: WdShowPasswordOn
  }
  Textarea?: {
    size?: WdSizeInput
    variant?: WdInputVariant
    fluid?: boolean
    clearable?: boolean
    showCount?: boolean
    rows?: number
    autosize?: WdTextareaAutosize
  }
  Select?: {
    size?: WdSizeInput
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
    size?: WdSizeInput
  }
  Space?: {
    size?: WdGapSize
  }
  Flex?: {
    size?: WdGapSize
  }
  InputNumber?: { size?: WdSizeInput }
  DatePicker?: { size?: WdSizeInput }
  Table?: { size?: WdSizeInput }
  AutoComplete?: { size?: WdSizeInput }
  CascadeSelect?: { size?: WdSizeInput; fluid?: boolean; clearable?: boolean }
  TreeSelect?: { size?: WdSizeInput; clearable?: boolean }
  SplitButton?: { size?: WdSizeInput }
  SelectButton?: { size?: WdSizeInput }
  ToggleButton?: { size?: WdSizeInput }
}

export type WdComponentDefaults = WdComponentDefaultMap & {
  [name: string]: Record<string, unknown> | undefined
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function normalizeComponentDefaultName(name: string): string {
  return name.startsWith('Wd') ? name.slice(2) : name
}

export function getComponentDefaults(
  defaults: WdComponentDefaults | undefined,
  name: string,
): Record<string, unknown> {
  if (!defaults) return {}
  const base = normalizeComponentDefaultName(name)
  const fromBase = defaults[base]
  const fromPrefixed = defaults[`Wd${base}`]
  return {
    ...(isPlainObject(fromBase) ? fromBase : {}),
    ...(isPlainObject(fromPrefixed) ? fromPrefixed : {}),
  }
}

export function getComponentDefault<T>(
  defaults: WdComponentDefaults | undefined,
  name: string,
  key: string,
): T | undefined {
  return getComponentDefaults(defaults, name)[key] as T | undefined
}

/** Deep-merge per component; child props win. */
export function mergeComponentDefaults(
  parent?: WdComponentDefaults,
  child?: WdComponentDefaults,
): WdComponentDefaults | undefined {
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
  return result as WdComponentDefaults
}
