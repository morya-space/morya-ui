import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import WdSplitter from './Splitter.vue'

describe('WdSplitter', () => {
  it('renders named panel slots', () => {
    const wrapper = mount(WdSplitter, {
      slots: {
        panel1: () => h('div', 'Left'),
        panel2: () => h('div', 'Right'),
      },
    })
    const panels = wrapper.findAll('.wd-splitter__panel')
    expect(panels).toHaveLength(2)
    expect(panels[0]!.text()).toBe('Left')
    expect(panels[1]!.text()).toBe('Right')
    expect(wrapper.find('.wd-splitter__gutter').exists()).toBe(true)
  })

  it('applies vertical layout class', () => {
    const wrapper = mount(WdSplitter, {
      props: { layout: 'vertical' },
      slots: {
        panel1: 'Top',
        panel2: 'Bottom',
      },
    })
    expect(wrapper.classes()).toContain('wd-splitter--vertical')
  })

  it('resizes on gutter drag via window mousemove', async () => {
    const wrapper = mount(WdSplitter, {
      props: { size: 50 },
      slots: {
        panel1: () => h('div', 'Left'),
        panel2: () => h('div', 'Right'),
      },
      attachTo: document.body,
    })

    const root = wrapper.get('.wd-splitter').element as HTMLElement
    Object.defineProperty(root, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100 }),
    })

    await wrapper.get('.wd-splitter__gutter').trigger('mousedown', {
      clientX: 100,
      clientY: 50,
    })
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 60, clientY: 50, bubbles: true }))
    window.dispatchEvent(new MouseEvent('mouseup', { clientX: 60, clientY: 50, bubbles: true }))
    await nextTick()

    expect(wrapper.emitted('update:size')?.at(-1)?.[0]).toBe(30)
    expect(wrapper.findAll('.wd-splitter__panel')[0]!.attributes('style')).toContain('30%')
    wrapper.unmount()
  })

  it('supports keyboard resize on the gutter', async () => {
    const wrapper = mount(WdSplitter, {
      props: { size: 50 },
      slots: {
        panel1: 'A',
        panel2: 'B',
      },
    })
    await wrapper.get('.wd-splitter__gutter').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:size')?.at(-1)?.[0]).toBe(51)
  })
})
