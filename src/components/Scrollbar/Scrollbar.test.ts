import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WiScrollbar from './Scrollbar.vue'

describe('wiScrollbar', () => {
  it('renders content and applies height to the wrap', () => {
    const wrapper = mount(WiScrollbar, {
      props: { height: 200, always: true },
      slots: {
        default: '<p class="item">One</p><p class="item">Two</p>',
      },
      attachTo: document.body,
    })

    expect(wrapper.get('.wi-scrollbar__view').text()).toContain('One')
    expect(wrapper.get('.wi-scrollbar__wrap').attributes('style')).toContain('height: 200px')
    wrapper.unmount()
  })

  it('hides the native scrollbar by default and exposes custom bars when always', async () => {
    const wrapper = mount(WiScrollbar, {
      props: { height: 120, always: true },
      slots: {
        default: Array.from({ length: 20 }, (_, i) => `<p style="height:40px">${i}</p>`).join(''),
      },
      attachTo: document.body,
    })

    await nextTick()
    expect(wrapper.get('.wi-scrollbar__wrap').classes()).toContain('wi-scrollbar__wrap--hidden-default')
    expect(wrapper.findAll('.wi-scrollbar__bar').length).toBe(2)
    wrapper.unmount()
  })

  it('uses native scrollbar when native is true', () => {
    const wrapper = mount(WiScrollbar, {
      props: { height: 120, native: true },
      slots: { default: '<p>Native</p>' },
    })

    expect(wrapper.find('.wi-scrollbar__bar').exists()).toBe(false)
    expect(wrapper.get('.wi-scrollbar__wrap').classes()).not.toContain(
      'wi-scrollbar__wrap--hidden-default',
    )
  })

  it('emits scroll and supports setScrollTop / setScrollLeft', async () => {
    const onScroll = vi.fn()
    const wrapper = mount(WiScrollbar, {
      props: { height: 100, always: true, onScroll },
      slots: {
        default: Array.from({ length: 30 }, (_, i) => `<p style="height:40px">${i}</p>`).join(''),
      },
      attachTo: document.body,
    })

    const wrap = wrapper.get('.wi-scrollbar__wrap').element as HTMLDivElement
    Object.defineProperty(wrap, 'scrollHeight', { configurable: true, value: 1200 })
    Object.defineProperty(wrap, 'clientHeight', { configurable: true, value: 100 })
    Object.defineProperty(wrap, 'scrollWidth', { configurable: true, value: 800 })
    Object.defineProperty(wrap, 'clientWidth', { configurable: true, value: 200 })

    const api = wrapper.vm as unknown as {
      setScrollTop: (v: number) => void
      setScrollLeft: (v: number) => void
    }
    api.setScrollTop(80)
    wrap.dispatchEvent(new Event('scroll'))
    await nextTick()

    expect(onScroll).toHaveBeenCalled()
    const payload = onScroll.mock.calls.at(-1)?.[0] as { scrollTop: number }
    expect(payload.scrollTop).toBe(80)

    api.setScrollLeft(40)
    wrap.dispatchEvent(new Event('scroll'))
    await nextTick()
    const leftPayload = onScroll.mock.calls.at(-1)?.[0] as { scrollLeft: number }
    expect(leftPayload.scrollLeft).toBe(40)

    wrapper.unmount()
  })

  it('applies max-height and view accessibility attributes', () => {
    const wrapper = mount(WiScrollbar, {
      props: {
        maxHeight: '240px',
        id: 'panel-view',
        role: 'region',
        ariaLabel: 'Scrollable panel',
        ariaOrientation: 'vertical',
      },
      slots: { default: '<p>Content</p>' },
    })

    expect(wrapper.get('.wi-scrollbar__wrap').attributes('style')).toContain('max-height: 240px')
    const view = wrapper.get('.wi-scrollbar__view')
    expect(view.attributes('id')).toBe('panel-view')
    expect(view.attributes('role')).toBe('region')
    expect(view.attributes('aria-label')).toBe('Scrollable panel')
    expect(view.attributes('aria-orientation')).toBe('vertical')
  })

  it('shows thumbs when trigger is none', async () => {
    const wrapper = mount(WiScrollbar, {
      props: { height: 120, trigger: 'none' },
      slots: {
        default: Array.from({ length: 20 }, (_, i) => `<p style="height:40px">${i}</p>`).join(''),
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.findAll('.wi-scrollbar__bar').length).toBe(2)
    wrapper.unmount()
  })
})
