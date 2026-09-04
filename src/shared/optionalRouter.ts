import type { Component } from 'vue'
import { getCurrentInstance, toRaw } from 'vue'

/** Minimal route target when vue-router is not installed. */
export type WdRouteLocationRaw = string | Record<string, unknown>

function appHasRouter(): boolean {
  const instance = getCurrentInstance()
  if (!instance) return false
  for (const value of Object.values(instance.appContext.provides)) {
    if (value && typeof value === 'object' && 'resolve' in value && 'push' in value) return true
  }
  return false
}

export function resolveOptionalRouterLink(): Component | null {
  const instance = getCurrentInstance()
  if (!instance || !appHasRouter()) return null
  const link = instance.appContext.components.RouterLink
  return (link as Component | undefined) ?? null
}

export function resolveRouteHref(to: WdRouteLocationRaw): string {
  if (typeof to === 'string') return to
  if (typeof to.path === 'string') return to.path
  if (typeof to.href === 'string') return to.href
  return '#'
}

export function isExternalRoute(to: WdRouteLocationRaw): boolean {
  if (typeof to === 'string') {
    return /^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(to) || to.startsWith('mailto:') || to.startsWith('tel:')
  }
  return false
}
