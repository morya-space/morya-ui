import { onBeforeUnmount, watch, type WatchSource } from 'vue'

/**
 * Attach window resize + capture-phase scroll listeners while a floating overlay is active.
 * Callers supply the reposition callback; this only owns attach/detach lifecycle.
 */
export function useFloatingViewportSync(active: WatchSource<boolean>, onChange: () => void) {
  let attached = false

  function attach() {
    if (attached || typeof window === 'undefined') return
    window.addEventListener('resize', onChange)
    window.addEventListener('scroll', onChange, true)
    attached = true
  }

  function detach() {
    if (!attached || typeof window === 'undefined') return
    window.removeEventListener('resize', onChange)
    window.removeEventListener('scroll', onChange, true)
    attached = false
  }

  watch(
    active,
    (isActive) => {
      if (isActive) attach()
      else detach()
    },
    { flush: 'sync' },
  )

  onBeforeUnmount(detach)

  return { attach, detach }
}
