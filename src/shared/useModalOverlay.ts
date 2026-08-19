import { nextTick, onUnmounted, toValue, type MaybeRefOrGetter, type Ref, watch, type WatchSource } from 'vue'

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'

export interface UseModalOverlayOptions {
  /** Whether the overlay is open. */
  open: WatchSource<boolean>
  /** Root element that should trap focus (dialog panel). */
  container: Ref<HTMLElement | null>
  /** Called on Escape when enabled. */
  onEscape?: () => void
  closeOnEsc?: MaybeRefOrGetter<boolean>
  /** Lock document body scroll while open. */
  blockScroll?: MaybeRefOrGetter<boolean>
  /** Move focus into the container when opened. */
  autoFocus?: boolean
  onOpen?: () => void
  onClose?: () => void
}

function resolveFlag(value: MaybeRefOrGetter<boolean> | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback
  return Boolean(toValue(value))
}

/**
 * Shared modal overlay behavior: Esc, optional scroll lock, focus restore, basic focus trap.
 * Anchored popups (Select/Menu) should not use this.
 */
export function useModalOverlay(options: UseModalOverlayOptions) {
  let previouslyFocused: HTMLElement | null = null
  let previousBodyOverflow = ''
  let opened = false

  function isEscEnabled() {
    return resolveFlag(options.closeOnEsc, true)
  }

  function isScrollLocked() {
    return resolveFlag(options.blockScroll, false)
  }

  function lockScroll(lock: boolean) {
    if (typeof document === 'undefined') return
    if (lock) {
      previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = previousBodyOverflow
    }
  }

  function getFocusable(): HTMLElement[] {
    const root = options.container.value
    if (!root) return []
    return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
    )
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isEscEnabled()) {
      event.stopPropagation()
      options.onEscape?.()
      return
    }
    if (event.key !== 'Tab') return
    const focusable = getFocusable()
    if (focusable.length === 0) {
      event.preventDefault()
      options.container.value?.focus()
      return
    }
    const first = focusable[0]!
    const last = focusable[focusable.length - 1]!
    const active = document.activeElement as HTMLElement | null
    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  async function activate() {
    if (opened || typeof document === 'undefined') return
    opened = true
    previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.addEventListener('keydown', onKeydown, true)
    if (isScrollLocked()) lockScroll(true)
    options.onOpen?.()
    if (options.autoFocus !== false) {
      await nextTick()
      const focusable = getFocusable()
      ;(focusable[0] ?? options.container.value)?.focus()
    }
  }

  function deactivate() {
    if (!opened || typeof document === 'undefined') return
    opened = false
    document.removeEventListener('keydown', onKeydown, true)
    if (isScrollLocked()) lockScroll(false)
    options.onClose?.()
    previouslyFocused?.focus?.()
    previouslyFocused = null
  }

  watch(
    options.open,
    (isOpen, wasOpen) => {
      if (isOpen) void activate()
      else if (wasOpen) deactivate()
    },
    { immediate: true },
  )

  onUnmounted(() => deactivate())

  return { activate, deactivate }
}
