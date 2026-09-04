import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdVirtualScroller from './VirtualScroller.vue'

describe('wdVirtualScroller', () => {
  it('renders a window of items', () => {
    const items = Array.from({ length: 100 }, (_, i) => `Item ${i}`)
    const wrapper = mount(WdVirtualScroller, {
      props: { items, itemSize: 32, height: 128, buffer: 0 },
      slots: {
        item: `<template #item="{ item }"><span class="row">{{ item }}</span></template>`,
      },
    })
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.length).toBeLessThan(items.length)
    expect(rows[0]!.text()).toBe('Item 0')
  })

  it('updates window on scroll', async () => {
    const items = Array.from({ length: 50 }, (_, i) => i)
    const wrapper = mount(WdVirtualScroller, {
      props: { items, itemSize: 20, height: 100, buffer: 0 },
    })
    const root = wrapper.find('.wd-virtualscroller')
    Object.defineProperty(root.element, 'scrollTop', { value: 200, configurable: true })
    await root.trigger('scroll')
    expect(wrapper.text()).toContain('10')
  })
})
