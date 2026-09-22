import type { MaybeRefOrGetter, Ref } from 'vue'
import { computed, onBeforeUnmount, ref, toValue, watch } from 'vue'

/**
 * Pause CSS animations on looping indicators while the target is off-screen.
 * Bind `pauseAttrs` on the animated root (supports `::before` / `::after` via theme CSS).
 */
export function usePauseOffscreen(
  el: Ref<Element | null | undefined>,
  enabled: MaybeRefOrGetter<boolean> = true,
) {
  const paused = ref(false)
  let observer: IntersectionObserver | null = null

  function disconnect() {
    observer?.disconnect()
    observer = null
  }

  function sync() {
    disconnect()
    paused.value = false
    if (typeof IntersectionObserver === 'undefined') return
    if (!toValue(enabled)) return
    const node = el.value
    if (!node) return

    observer = new IntersectionObserver(
      ([entry]) => {
        paused.value = !(entry?.isIntersecting ?? true)
      },
      { root: null, rootMargin: '64px 0px', threshold: 0 },
    )
    observer.observe(node)
  }

  watch([el, () => toValue(enabled)], sync, { flush: 'post' })
  onBeforeUnmount(disconnect)

  const pauseAttrs = computed(() =>
    paused.value ? ({ 'data-m-anim-paused': '' } as const) : {},
  )

  return { paused, pauseAttrs }
}
