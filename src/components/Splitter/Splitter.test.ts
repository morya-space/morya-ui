import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import WiSplitter from './Splitter.vue'

describe('wiSplitter', () => {
  it('renders named panel slots', () => {
    const wrapper = mount(WiSplitter, {
      slots: {
        panel1: () => h('div', 'Left'),
        panel2: () => h('div', 'Right'),
      },
    })
    const panels = wrapper.findAll('.wi-splitter__panel')
    expect(panels).toHaveLength(2)
    expect(panels[0]!.text()).toBe('Left')
    expect(panels[1]!.text()).toBe('Right')
    expect(wrapper.find('.wi-splitter__gutter').exists()).toBe(true)
  })

  it('supports direction alias for layout', () => {
    const wrapper = mount(WiSplitter, {
      props: { direction: 'vertical' },
      slots: { panel1: 'Top', panel2: 'Bottom' },
    })
    expect(wrapper.classes()).toContain('wi-splitter--vertical')
  })

  it('resizes on gutter drag via window mousemove', async () => {
    const wrapper = mount(WiSplitter, {
      props: { size: 50 },
      slots: {
        panel1: () => h('div', 'Left'),
        panel2: () => h('div', 'Right'),
      },
      attachTo: document.body,
    })

    const root = wrapper.get('.wi-splitter').element as HTMLElement
    Object.defineProperty(root, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 206, height: 100, right: 206, bottom: 100 }),
    })

    await wrapper.get('.wi-splitter__gutter').trigger('mousedown', {
      clientX: 100,
      clientY: 50,
    })
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 60, clientY: 50, bubbles: true }))
    window.dispatchEvent(new MouseEvent('mouseup', { clientX: 60, clientY: 50, bubbles: true }))
    await nextTick()

    // usable = 206 - 6 = 200; start 50% = 100px; delta -40 → 60px → 30%
    expect(wrapper.emitted('update:size')?.at(-1)?.[0]).toBe(30)
    expect(wrapper.emitted('drag-start')).toBeTruthy()
    expect(wrapper.emitted('drag-end')).toBeTruthy()
    await wrapper.setProps({ size: 30 })
    expect(wrapper.findAll('.wi-splitter__panel')[0]!.attributes('style')).toContain('30%')
    wrapper.unmount()
  })

  it('supports keyboard resize on the gutter', async () => {
    const wrapper = mount(WiSplitter, {
      props: { size: 50 },
      slots: {
        panel1: 'A',
        panel2: 'B',
      },
    })
    await wrapper.get('.wi-splitter__gutter').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:size')?.at(-1)?.[0]).toBe(51)
  })

  it('supports ratio size mode', () => {
    const wrapper = mount(WiSplitter, {
      props: { size: 0.35 },
      slots: { panel1: 'A', panel2: 'B' },
    })
    expect(wrapper.findAll('.wi-splitter__panel')[0]!.attributes('style')).toContain('35%')
  })

  it('does not drag when disabled', async () => {
    const wrapper = mount(WiSplitter, {
      props: { size: 50, disabled: true },
      slots: { panel1: 'A', panel2: 'B' },
      attachTo: document.body,
    })
    const root = wrapper.get('.wi-splitter').element as HTMLElement
    Object.defineProperty(root, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100 }),
    })
    await wrapper.get('.wi-splitter__gutter').trigger('mousedown', { clientX: 100, clientY: 50 })
    expect(wrapper.emitted('drag-start')).toBeFalsy()
    wrapper.unmount()
  })
})
