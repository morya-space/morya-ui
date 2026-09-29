export type AffixScrollTarget = HTMLElement | Window | null | undefined

export function getTargetRect(target: AffixScrollTarget): DOMRect {
  if (target !== window) {
    return (target as HTMLElement).getBoundingClientRect()
  }
  return { top: 0, bottom: window.innerHeight } as DOMRect
}

export function getFixedTop(
  placeholderRect: DOMRect,
  targetRect: DOMRect,
  offsetTop?: number,
) {
  if (
    offsetTop !== undefined
    && Math.round(targetRect.top) > Math.round(placeholderRect.top) - offsetTop
  ) {
    return offsetTop + targetRect.top
  }
  return undefined
}

export function getFixedBottom(
  placeholderRect: DOMRect,
  targetRect: DOMRect,
  offsetBottom?: number,
) {
  if (
    offsetBottom !== undefined
    && Math.round(targetRect.bottom) < Math.round(placeholderRect.bottom) + offsetBottom
  ) {
    const targetBottomOffset = window.innerHeight - targetRect.bottom
    return offsetBottom + targetBottomOffset
  }
  return undefined
}

export function throttleByAnimationFrame<T extends (...args: never[]) => void>(fn: T) {
  let ticking = false
  let rafId = 0

  const wrapped = (...args: Parameters<T>) => {
    if (ticking) return
    ticking = true
    rafId = requestAnimationFrame(() => {
      ticking = false
      fn(...args)
    })
  }

  wrapped.cancel = () => {
    if (rafId) cancelAnimationFrame(rafId)
    ticking = false
    rafId = 0
  }

  return wrapped
}
