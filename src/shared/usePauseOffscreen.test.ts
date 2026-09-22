import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePauseOffscreen } from './usePauseOffscreen'

type ObserverCallback = IntersectionObserverCallback

describe('usePauseOffscreen', () => {
  let callback: ObserverCallback | null = null
  let observe = vi.fn()
  let disconnect = vi.fn()

  beforeEach(() => {
    callback = null
    observe = vi.fn()
    disconnect = vi.fn()
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: ObserverCallback) {
          callback = cb
        }
        observe = observe
        disconnect = disconnect
        unobserve = vi.fn()
        takeRecords = () => []
        root = null
        rootMargin = ''
        thresholds = []
      },
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sets data-m-anim-paused when the target leaves the viewport', async () => {
    const Host = defineComponent({
      setup() {
        const el = ref<HTMLElement | null>(null)
        const { pauseAttrs } = usePauseOffscreen(el, true)
        return { el, pauseAttrs }
      },
      template: '<div ref="el" v-bind="pauseAttrs">wave</div>',
    })

    const wrapper = mount(Host)
    await nextTick()
    expect(observe).toHaveBeenCalled()
    expect(wrapper.attributes('data-m-anim-paused')).toBeUndefined()

    callback?.(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
    await nextTick()
    expect(wrapper.attributes('data-m-anim-paused')).toBe('')

    callback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
    await nextTick()
    expect(wrapper.attributes('data-m-anim-paused')).toBeUndefined()
  })

  it('does not observe when enabled is false', async () => {
    const Host = defineComponent({
      setup() {
        const el = ref<HTMLElement | null>(null)
        const enabled = ref(false)
        const { pauseAttrs } = usePauseOffscreen(el, enabled)
        return { el, pauseAttrs, enabled }
      },
      template: '<div ref="el" v-bind="pauseAttrs">idle</div>',
    })

    const wrapper = mount(Host)
    await nextTick()
    expect(observe).not.toHaveBeenCalled()

    wrapper.vm.enabled = true
    await nextTick()
    expect(observe).toHaveBeenCalled()
  })
})
