import type { MaybeRefOrGetter } from 'vue'
import type { PassThroughOptions, PassThroughPart } from './passThrough'
import { computed, toValue } from 'vue'

type ClassValue = string | Record<string, boolean> | Array<string | Record<string, boolean>>
type StyleValue = string | Record<string, string | number>

/** Merge class values the same way Vue merges `:class` bindings. */
export function mergeClasses(...values: unknown[]): ClassValue | undefined {
  const flat: Array<string | Record<string, boolean>> = []

  function append(value: unknown) {
    if (value == null || value === false) return
    if (typeof value === 'string') {
      if (value.trim()) flat.push(value)
      return
    }
    if (Array.isArray(value)) {
      value.forEach(append)
      return
    }
    if (typeof value === 'object') flat.push(value as Record<string, boolean>)
  }

  values.forEach(append)
  if (flat.length === 0) return undefined
  if (flat.length === 1) return flat[0]
  return flat
}

/** Shallow-merge style objects; later values win per key. */
export function mergeStyles(...values: unknown[]): StyleValue | undefined {
  let result: Record<string, string | number> | string | undefined
  for (const value of values) {
    if (value == null || value === false) continue
    if (typeof value === 'string') {
      result = value
      continue
    }
    if (typeof value === 'object') {
      result = { ...(typeof result === 'object' ? result : {}), ...(value as Record<string, string | number>) }
    }
  }
  return result
}

/** Merge pass-through parts; `class` and `style` are combined, other keys are overwritten. */
export function mergePtPart(...parts: (PassThroughPart | undefined)[]): PassThroughPart {
  const result: PassThroughPart = {}
  for (const part of parts) {
    if (!part) continue
    for (const [key, value] of Object.entries(part)) {
      if (key === 'class') {
        result.class = mergeClasses(result.class, value)
      } else if (key === 'style') {
        result.style = mergeStyles(result.style, value)
      } else {
        result[key] = value
      }
    }
  }
  return result
}

/** Layout-oriented keys that always merge onto the field root. */
export function isRootLayoutKey(key: string): boolean {
  return key === 'class' || key === 'style' || key.startsWith('data-')
}

/** @deprecated Use {@link isRootLayoutKey}. */
export function isRootFallthroughKey(key: string): boolean {
  return isRootLayoutKey(key)
}

/** Whether a fallthrough key is an event listener for the native control. */
export function isControlEventKey(key: string, value: unknown): boolean {
  return key.startsWith('on') && typeof value === 'function'
}

/**
 * Hybrid field attrs split:
 * - root: all fallthrough attrs except listeners bound to the native control
 * - control: event listeners (`onXxx`) only
 * - props / `pt.<part>`: attrs explicitly declared or targeted on inner DOM
 */
export function splitHybridFieldAttrs(attrs: Record<string, unknown>) {
  const rootPart: PassThroughPart = {}
  const controlPart: PassThroughPart = {}

  for (const [key, value] of Object.entries(attrs)) {
    if (isControlEventKey(key, value)) {
      controlPart[key] = value
    } else if (key === 'class') {
      rootPart.class = mergeClasses(rootPart.class, value)
    } else if (key === 'style') {
      rootPart.style = mergeStyles(rootPart.style, value)
    } else {
      rootPart[key] = value
    }
  }

  return { rootPart, controlPart }
}

/** @deprecated Use {@link splitHybridFieldAttrs} for field components. */
export function splitRootControlAttrs(attrs: Record<string, unknown>) {
  const { rootPart, controlPart } = splitHybridFieldAttrs(attrs)
  return {
    rootClass: rootPart.class,
    rootStyle: rootPart.style,
    controlAttrs: controlPart,
  }
}

export interface FieldPartsOptions {
  /** Pass-through key for the native control (default: `input`). */
  controlKey?: string
}

/**
 * Compound field components (hybrid pattern):
 * - fallthrough attrs (except control events) → root
 * - event listeners → native control
 * - common native semantics → explicit props on the control
 * - attrs for a specific inner part → `pt.<part>`
 */
export function useFieldParts<T extends PassThroughOptions = PassThroughOptions>(
  attrs: MaybeRefOrGetter<Record<string, unknown>>,
  pt?: MaybeRefOrGetter<T | undefined>,
  options?: FieldPartsOptions,
) {
  const controlKey = options?.controlKey ?? 'input'

  const rootAttrs = computed(() => {
    const { rootPart } = splitHybridFieldAttrs(toValue(attrs))
    return mergePtPart(rootPart, toValue(pt)?.root)
  })

  const controlAttrs = computed(() => {
    const { controlPart } = splitHybridFieldAttrs(toValue(attrs))
    const ptControl = toValue(pt)?.[controlKey]
    return mergePtPart(controlPart, ptControl)
  })

  return { rootAttrs, controlAttrs }
}

/**
 * Label-root controls (Checkbox, Radio, Switch): hybrid split with control key `input`.
 * Promote `name` / `value` to props; use `pt.input` for other native attrs.
 */
export function useControlRootParts<T extends PassThroughOptions = PassThroughOptions>(
  attrs: MaybeRefOrGetter<Record<string, unknown>>,
  pt?: MaybeRefOrGetter<T | undefined>,
) {
  return useFieldParts(attrs, pt, { controlKey: 'input' })
}

/** Single-root components: all fallthrough attrs bind to the root element. */
export function useRootParts<T extends PassThroughOptions = PassThroughOptions>(
  attrs: MaybeRefOrGetter<Record<string, unknown>>,
  pt?: MaybeRefOrGetter<T | undefined>,
) {
  const rootAttrs = computed(() => mergePtPart(toValue(attrs), toValue(pt)?.root))

  return { rootAttrs }
}
