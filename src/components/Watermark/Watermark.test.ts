import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import MWatermark from './Watermark.vue'

describe('muWatermark', () => {
  it('renders children and watermark root', () => {
    const wrapper = mount(MWatermark, {
      props: { content: 'Demo' },
      slots: { default: '<p class="child">Content</p>' },
    })
    expect(wrapper.find('.child').text()).toBe('Content')
    expect(wrapper.classes()).toContain('m-watermark')
  })

  it('creates overlay with background image after pattern render', async () => {
    const ctx = {
      save: vi.fn(),
      restore: vi.fn(),
      fillText: vi.fn(),
      drawImage: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      textBaseline: '',
      textAlign: '',
      font: '',
      fillStyle: '',
      globalAlpha: 1,
    }
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
    HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,test')
    const wrapper = mount(MWatermark, {
      props: { content: 'Morya' },
      attachTo: document.body,
    })
    await flushPromises()
    await nextTick()
    const overlay = wrapper.find('.m-watermark__overlay')
    expect(overlay.exists()).toBe(true)
    expect(overlay.attributes('style')).toContain('background-image')
    wrapper.unmount()
  })

  it('re-appends overlay when removed from DOM', async () => {
    let observerCallback: MutationCallback | null = null
    const Observer = vi.fn(function MockMutationObserver(this: MutationObserver, cb: MutationCallback) {
      observerCallback = cb
    })
    Observer.prototype.observe = vi.fn()
    Observer.prototype.disconnect = vi.fn()
    vi.stubGlobal('MutationObserver', Observer)

    const ctx = {
      save: vi.fn(),
      restore: vi.fn(),
      fillText: vi.fn(),
      drawImage: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      textBaseline: '',
      textAlign: '',
      font: '',
      fillStyle: '',
      globalAlpha: 1,
    }
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
    HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,test')
    const wrapper = mount(MWatermark, {
      props: { content: 'Morya' },
      attachTo: document.body,
    })
    await flushPromises()
    await nextTick()
    const root = wrapper.find('.m-watermark').element as HTMLElement
    const querySpy = vi.spyOn(root, 'querySelector').mockReturnValue(null)
    observerCallback?.([], {} as MutationObserver)
    await flushPromises()
    await nextTick()
    querySpy.mockRestore()
    expect(wrapper.find('.m-watermark__overlay').exists()).toBe(true)
    wrapper.unmount()
    vi.unstubAllGlobals()
  })
})
