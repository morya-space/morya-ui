import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WiScrollTop from './ScrollTop.vue'

describe('WiScrollTop', () => {
  it('becomes visible after threshold and scrolls window', async () => {
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 500 })
    const wrapper = mount(WiScrollTop, { props: { threshold: 400 }, attachTo: document.body })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    const button = document.body.querySelector('.wi-scrolltop') as HTMLButtonElement
    expect(button.classList.contains('wi-scrolltop--visible')).toBe(true)
    button.click()
    expect(scrollTo).toHaveBeenCalled()
    wrapper.unmount()
    vi.unstubAllGlobals()
  })

  it('stays hidden below threshold', async () => {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 10 })
    const wrapper = mount(WiScrollTop, { props: { threshold: 400 }, attachTo: document.body })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    const button = document.body.querySelector('.wi-scrolltop') as HTMLButtonElement
    expect(button.classList.contains('wi-scrolltop--visible')).toBe(false)
    wrapper.unmount()
  })

  it('teleports button to body by default', async () => {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 500 })
    const wrapper = mount(WiScrollTop, { props: { threshold: 400 }, attachTo: document.body })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(document.body.querySelector('.wi-scrolltop--teleported')).toBeTruthy()
    expect(wrapper.find('.wi-scrolltop').exists()).toBe(false)
    wrapper.unmount()
  })

  it('applies right and bottom offsets', async () => {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 500 })
    const wrapper = mount(WiScrollTop, {
      props: { threshold: 400, right: 24, bottom: 32 },
      attachTo: document.body,
    })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    const button = document.body.querySelector('.wi-scrolltop') as HTMLButtonElement
    expect(button.style.right).toBe('24px')
    expect(button.style.bottom).toBe('32px')
    wrapper.unmount()
  })
})
