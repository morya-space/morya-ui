import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiCarousel from './Carousel.vue'

describe('WiCarousel', () => {
  it('pages through items', async () => {
    const wrapper = mount(WiCarousel, {
      props: { value: ['a', 'b', 'c'], numVisible: 1 },
      slots: {
        item: `<template #item="{ item }"><span class="slide">{{ item }}</span></template>`,
      },
    })
    expect(wrapper.find('.slide').text()).toBe('a')
    await wrapper.find('[aria-label="下一页"]').trigger('click')
    expect(wrapper.find('.slide').text()).toBe('b')
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
  })

  it('wraps when circular', async () => {
    const wrapper = mount(WiCarousel, {
      props: { value: ['a', 'b'], numVisible: 1, circular: true },
    })
    await wrapper.find('[aria-label="上一页"]').trigger('click')
    expect(wrapper.text()).toContain('b')
  })
})
