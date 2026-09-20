import type { AppContext } from 'vue'
import type { MRenderable } from '../../shared/content'
import type { MSizeInput } from '../../shared/types'
import type { LoadingEffect, LoadingServiceInstance, LoadingServiceOptions } from './types'
import { defineComponent, h, reactive, render, Transition } from 'vue'
import { renderMContent } from '../../shared/content'
import { getMOverlayAppContext } from '../../shared/overlayHost'
import LoadingIndicator from './LoadingIndicator.vue'

export interface LoadingMaskInstance extends LoadingServiceInstance {
  update: (next: Partial<LoadingMaskOptions>) => void
  /** Tear down without waiting for leave transition. */
  destroy: () => void
}

export interface LoadingMaskOptions {
  target: HTMLElement
  text?: string
  effect?: LoadingEffect
  background?: string
  customClass?: string
  size?: MSizeInput
  fullscreen?: boolean
  lock?: boolean
  /** Position the mask over `target`, but mount it on `document.body`. */
  body?: boolean
  delay?: number
  spinner?: MRenderable
  appContext?: AppContext | null
}

interface MaskState {
  visible: boolean
  text: string
  effect?: LoadingEffect
  background?: string
  customClass?: string
  size?: MSizeInput
  fullscreen: boolean
  body: boolean
  spinner?: MRenderable
  top: number
  left: number
  width: number
  height: number
}

interface MaskRecord {
  fullscreen: boolean
  destroy: () => void
  close: () => void
}

const openMasks = new Set<MaskRecord>()
let fullscreenMask: MaskRecord | null = null

let scrollLockCount = 0
let previousBodyOverflow = ''

export function lockLoadingScroll() {
  if (typeof document === 'undefined') return
  if (scrollLockCount === 0) previousBodyOverflow = document.body.style.overflow
  scrollLockCount += 1
  document.body.style.overflow = 'hidden'
}

export function unlockLoadingScroll() {
  if (typeof document === 'undefined') return
  scrollLockCount = Math.max(0, scrollLockCount - 1)
  if (scrollLockCount === 0) document.body.style.overflow = previousBodyOverflow
}

function resolveTarget(target?: string | HTMLElement): HTMLElement {
  if (typeof document === 'undefined') {
    throw new Error('[MLoading] service is only available in the browser')
  }
  if (!target || target === document.body) return document.body
  if (typeof target === 'string') {
    const found = document.querySelector(target)
    if (!(found instanceof HTMLElement)) {
      throw new TypeError(`[MLoading] target not found: ${target}`)
    }
    return found
  }
  return target
}

function scheduleMeasure(run: () => void) {
  let frame = 0
  return () => {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      run()
    })
  }
}

export function mountLoadingMask(options: LoadingMaskOptions): LoadingMaskInstance {
  const state = reactive<MaskState>({
    visible: !options.delay,
    text: options.text ?? '',
    effect: options.effect,
    background: options.background,
    customClass: options.customClass,
    size: options.size,
    fullscreen: Boolean(options.fullscreen),
    body: Boolean(options.body) && !options.fullscreen,
    spinner: options.spinner,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  })

  if (state.fullscreen && fullscreenMask) fullscreenMask.destroy()

  const host = document.createElement('div')
  const parent = state.fullscreen || state.body ? document.body : options.target
  parent.appendChild(host)

  let relativeAdded = false
  if (!state.fullscreen && !state.body) {
    const position = getComputedStyle(options.target).position
    if (!position || position === 'static') {
      options.target.classList.add('m-loading-parent--relative')
      relativeAdded = true
    }
  }

  options.target.setAttribute('aria-busy', 'true')

  let locked = false
  function applyLock(next: boolean) {
    if (next && !locked) {
      lockLoadingScroll()
      locked = true
      return
    }
    if (!next && locked) {
      unlockLoadingScroll()
      locked = false
    }
  }
  if (state.visible) applyLock(Boolean(options.lock))

  function measure() {
    if (!state.body) return
    const rect = options.target.getBoundingClientRect()
    state.top = rect.top
    state.left = rect.left
    state.width = rect.width
    state.height = rect.height
  }

  const onViewportChange = scheduleMeasure(measure)
  let resizeObserver: ResizeObserver | null = null

  if (state.body) {
    measure()
    window.addEventListener('scroll', onViewportChange, true)
    window.addEventListener('resize', onViewportChange)
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(onViewportChange)
      resizeObserver.observe(options.target)
    }
  }

  let delayTimer: ReturnType<typeof setTimeout> | null = null
  if (options.delay && options.delay > 0) {
    delayTimer = setTimeout(() => {
      delayTimer = null
      state.visible = true
      applyLock(Boolean(options.lock))
    }, options.delay)
  }

  let leaveTimer: ReturnType<typeof setTimeout> | null = null
  let closed = false
  let destroyed = false
  let record: MaskRecord | null = null

  function cleanup() {
    if (destroyed) return
    destroyed = true
    closed = true
    if (delayTimer !== null) {
      clearTimeout(delayTimer)
      delayTimer = null
    }
    if (leaveTimer !== null) {
      clearTimeout(leaveTimer)
      leaveTimer = null
    }
    applyLock(false)
    if (state.body) {
      window.removeEventListener('scroll', onViewportChange, true)
      window.removeEventListener('resize', onViewportChange)
      resizeObserver?.disconnect()
      resizeObserver = null
    }
    if (relativeAdded) options.target.classList.remove('m-loading-parent--relative')
    if (options.target.getAttribute('aria-busy') === 'true') options.target.removeAttribute('aria-busy')
    render(null, host)
    host.remove()
    if (record) {
      openMasks.delete(record)
      if (fullscreenMask === record) fullscreenMask = null
    }
  }

  const Mask = defineComponent({
    name: 'MLoadingMask',
    setup() {
      return () =>
        h(
          Transition,
          {
            name: 'm-loading',
            appear: true,
            // Keep leave completion reliable in jsdom / reduced-motion environments.
            duration: { enter: 180, leave: 130 },
            onAfterLeave: () => cleanup(),
          },
          {
            default: () => {
              if (!state.visible) return null
              const classes = [
                'm-loading-mask',
                state.fullscreen ? 'm-loading-mask--fullscreen' : undefined,
                state.body ? 'm-loading-mask--body' : undefined,
                state.customClass || undefined,
              ].filter((item): item is string => Boolean(item))
              const style: Record<string, string> = {}
              if (state.background) style.background = state.background
              if (state.body) {
                style.top = `${state.top}px`
                style.left = `${state.left}px`
                style.width = `${state.width}px`
                style.height = `${state.height}px`
              }
              const indicator = state.spinner
                ? renderMContent(state.spinner)
                : h(LoadingIndicator, {
                    effect: state.effect,
                    size: state.size,
                    text: state.text || undefined,
                  })
              return h('div', { class: classes, style }, [indicator])
            },
          },
        )
    },
  })

  record = {
    fullscreen: state.fullscreen,
    destroy: cleanup,
    close() {
      if (closed) return
      closed = true
      if (delayTimer !== null) {
        clearTimeout(delayTimer)
        delayTimer = null
        cleanup()
        return
      }
      if (!state.visible) {
        cleanup()
        return
      }
      state.visible = false
      leaveTimer = setTimeout(cleanup, 200)
    },
  }
  openMasks.add(record)
  if (state.fullscreen) fullscreenMask = record

  const vnode = h(Mask)
  vnode.appContext = options.appContext ?? getMOverlayAppContext()
  render(vnode, host)

  return {
    close: () => record.close(),
    destroy: () => cleanup(),
    setText(text: string) {
      if (destroyed) return
      state.text = text
    },
    update(next) {
      if (destroyed) return
      if (next.text !== undefined) state.text = next.text
      if (next.effect !== undefined) state.effect = next.effect
      if (next.background !== undefined) state.background = next.background
      if (next.customClass !== undefined) state.customClass = next.customClass
      if (next.size !== undefined) state.size = next.size
      if (next.spinner !== undefined) state.spinner = next.spinner
      if (next.lock !== undefined && state.visible) applyLock(next.lock)
    },
  }
}

function noopInstance(): LoadingServiceInstance {
  return { close() {}, setText() {}, destroy() {} }
}

export function loadingService(options: LoadingServiceOptions = {}): LoadingServiceInstance {
  if (typeof document === 'undefined') return noopInstance()
  const fullscreen = options.fullscreen ?? (options.target == null && !options.body)
  const target = fullscreen ? document.body : resolveTarget(options.target ?? document.body)
  const mask = mountLoadingMask({
    target,
    fullscreen,
    body: Boolean(options.body) && !fullscreen,
    lock: options.lock,
    text: options.text,
    effect: options.effect,
    background: options.background,
    customClass: options.customClass,
    size: options.size,
    delay: options.delay,
    spinner: options.spinner,
  })
  return {
    close: () => mask.close(),
    setText: (text: string) => mask.setText(text),
    destroy: () => mask.destroy(),
  }
}

/** Imperative loading service: `loading.service({ text: '加载中' })`. */
export const loading = {
  service: loadingService,
}

/** @internal */
export function resetLoadingService() {
  for (const mask of [...openMasks]) mask.destroy()
  fullscreenMask = null
  scrollLockCount = 0
  if (typeof document !== 'undefined') document.body.style.overflow = previousBodyOverflow
}
