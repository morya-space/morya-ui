import { h, isVNode, type Component, type VNode, type VNodeChild } from 'vue'

/**
 * Content accepted by Message / Toast APIs:
 * string, number, VNode (`h(...)`), component, or a factory `() => VNodeChild`.
 */
export type WdRenderable =
  | string
  | number
  | VNode
  | Component
  | (() => VNodeChild)

function isComponentLike(value: unknown): value is Component {
  if (value == null || isVNode(value)) return false
  if (typeof value === 'function') {
    const fn = value as Component & {
      setup?: unknown
      render?: unknown
      __vccOpts?: unknown
      props?: unknown
      emits?: unknown
      components?: unknown
    }
    return Boolean(fn.setup || fn.render || fn.__vccOpts || fn.props || fn.emits || fn.components)
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    return Boolean(
      obj.setup ||
        obj.render ||
        obj.template ||
        obj.__vccOpts ||
        obj.props ||
        obj.emits ||
        obj.components ||
        obj.methods,
    )
  }
  return false
}

/** Resolve API / slot content into something Vue can render. */
export function renderWdContent(value: WdRenderable | null | undefined): VNodeChild {
  if (value == null) return null
  if (typeof value === 'string' || typeof value === 'number') return value
  if (isVNode(value)) return value
  if (typeof value === 'function') {
    if (isComponentLike(value)) return h(value)
    return (value as () => VNodeChild)()
  }
  return h(value)
}

/** Best-effort plain text for aria-labels when content is rich. */
export function plainTextOf(value: WdRenderable | null | undefined): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return ''
}

export function isMessageOptionsObject(value: unknown): value is { content: WdRenderable } {
  return (
    !!value &&
    typeof value === 'object' &&
    !isVNode(value) &&
    'content' in (value as object) &&
    !isComponentLike(value)
  )
}

export function isToastOptionsObject(value: unknown): value is { summary: WdRenderable } {
  return (
    !!value &&
    typeof value === 'object' &&
    !isVNode(value) &&
    'summary' in (value as object) &&
    !isComponentLike(value)
  )
}
