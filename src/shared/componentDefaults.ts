import type { RdGapSize } from './gap'
import type { RdInputVariant, RdSizeInput } from './types'

export type RdShowPasswordOn = 'click' | 'mousedown'

export type RdTextareaAutosize = boolean | { minRows?: number; maxRows?: number }

/**
 * Per-component default props, keyed by unprefixed name (`Input`) or `Rd*` alias.
 * Only props that a component actually reads from config are listed; extra keys are ignored.
 */
export interface RdComponentDefaultMap {
  Input?: {
    size?: RdSizeInput
    variant?: RdInputVariant
    fluid?: boolean
    clearable?: boolean
    showCount?: boolean
  }
  InputPassword?: {
    size?: RdSizeInput
    variant?: RdInputVariant
    fluid?: boolean
    clearable?: boolean
    showCount?: boolean
    toggleMask?: boolean
    showPasswordOn?: RdShowPasswordOn
  }
  Textarea?: {
    size?: RdSizeInput
    variant?: RdInputVariant
    fluid?: boolean
    clearable?: boolean
    showCount?: boolean
    rows?: number
    autosize?: RdTextareaAutosize
  }
  Select?: {
    size?: RdSizeInput
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
    size?: RdSizeInput
  }
  Space?: {
    size?: RdGapSize
  }
  Flex?: {
    size?: RdGapSize
  }
  InputNumber?: { size?: RdSizeInput }
  DatePicker?: { size?: RdSizeInput }
  Table?: { size?: RdSizeInput }
  AutoComplete?: { size?: RdSizeInput }
  CascadeSelect?: { size?: RdSizeInput; fluid?: boolean; clearable?: boolean }
  TreeSelect?: { size?: RdSizeInput; clearable?: boolean }
  SplitButton?: { size?: RdSizeInput }
  SelectButton?: { size?: RdSizeInput }
  ToggleButton?: { size?: RdSizeInput }
}

export type RdComponentDefaults = RdComponentDefaultMap & {
  [name: string]: Record<string, unknown> | undefined
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function normalizeComponentDefaultName(name: string): string {
  return name.startsWith('Rd') ? name.slice(2) : name
}

export function getComponentDefaults(
  defaults: RdComponentDefaults | undefined,
  name: string,
): Record<string, unknown> {
  if (!defaults) return {}
  const base = normalizeComponentDefaultName(name)
  const fromBase = defaults[base]
  const fromPrefixed = defaults[`Rd${base}`]
  return {
    ...(isPlainObject(fromBase) ? fromBase : {}),
    ...(isPlainObject(fromPrefixed) ? fromPrefixed : {}),
  }
}

export function getComponentDefault<T>(
  defaults: RdComponentDefaults | undefined,
  name: string,
  key: string,
): T | undefined {
  return getComponentDefaults(defaults, name)[key] as T | undefined
}

/** Deep-merge per component; child props win. */
export function mergeComponentDefaults(
  parent?: RdComponentDefaults,
  child?: RdComponentDefaults,
): RdComponentDefaults | undefined {
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
  return result as RdComponentDefaults
}
