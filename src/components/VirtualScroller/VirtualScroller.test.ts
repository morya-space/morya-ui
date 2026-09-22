import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MVirtualScroller from './VirtualScroller.vue'

describe('muVirtualScroller', () => {
  it('renders a window of items', () => {
    const items = Array.from({ length: 100 }, (_, i) => `Item ${i}`)
    const wrapper = mount(MVirtualScroller, {
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

  it('scrollToIndex moves the window', async () => {
    const items = Array.from({ length: 50 }, (_, i) => i)
    const wrapper = mount(MVirtualScroller, {
      props: { items, itemSize: 20, height: 100, buffer: 0 },
    })
    const api = wrapper.vm as unknown as { scrollToIndex: (i: number) => void }
    api.scrollToIndex(20)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('20')
  })
})
