import type { AnchorContainer } from './types'

const HASH_ID = /#([^\t\r\n\f\v]+)$/

export function extractHashId(href: string): string | null {
  const match = HASH_ID.exec(href)
  return match?.[1] ?? null
}

export function getOffsetTop(element: HTMLElement, container: AnchorContainer): number {
  if (!element.getClientRects().length) return 0
  const rect = element.getBoundingClientRect()
  if (!rect.width && !rect.height) return rect.top
  if (container === window) {
    return rect.top - element.ownerDocument.documentElement.clientTop
  }
  const containerRect = (container as HTMLElement).getBoundingClientRect()
  return rect.top - containerRect.top
}

export function getScrollTop(container: AnchorContainer): number {
  if (container === window) {
    return window.scrollY || document.documentElement.scrollTop
  }
  return (container as HTMLElement).scrollTop
}

export function scrollContainerTo(
  container: AnchorContainer,
  top: number,
  behavior: ScrollBehavior = 'smooth',
) {
  if (container === window) {
    window.scrollTo({ top, behavior })
    return
  }
  ;(container as HTMLElement).scrollTo({ top, behavior })
}

export function resolveScrollTarget(id: string): HTMLElement | null {
  if (typeof document === 'undefined') return null
  return document.getElementById(id)
}
