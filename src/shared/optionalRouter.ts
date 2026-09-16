import type { Component } from 'vue'
import { getCurrentInstance } from 'vue'

/** Minimal route target when vue-router is not installed. */
export type MRouteLocationRaw = string | Record<string, unknown>

function isRouterLike(value: unknown): boolean {
  return Boolean(
    value
    && typeof value === 'object'
    && 'resolve' in value
    && 'push' in value,
  )
}

/**
 * Vue Router injects via a Symbol key. `Object.values(provides)` skips Symbols,
 * so we must walk `Reflect.ownKeys`.
 */
export function appHasRouter(): boolean {
  const instance = getCurrentInstance()
  if (!instance) return false

  const provides = instance.appContext.provides
  for (const key of Reflect.ownKeys(provides)) {
    if (isRouterLike(provides[key as keyof typeof provides])) return true
  }

  let current: typeof instance | null = instance
  while (current) {
    const local = (current as { provides?: Record<PropertyKey, unknown> }).provides
    if (local) {
      for (const key of Reflect.ownKeys(local)) {
        if (isRouterLike(local[key])) return true
      }
    }
    current = current.parent
  }

  return Boolean(instance.appContext.components.RouterLink)
}

export function resolveOptionalRouterLink(): Component | null {
  const instance = getCurrentInstance()
  if (!instance || !appHasRouter()) return null
  const link = instance.appContext.components.RouterLink
  return (link as Component | undefined) ?? null
}

export function resolveRouteHref(to: MRouteLocationRaw): string {
  if (typeof to === 'string') return to
  if (typeof to.path === 'string') return to.path
  if (typeof to.href === 'string') return to.href
  return '#'
}

export function isExternalRoute(to: MRouteLocationRaw): boolean {
  if (typeof to === 'string') {
    return /^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(to) || to.startsWith('mailto:') || to.startsWith('tel:')
  }
  return false
}
