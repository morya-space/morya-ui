import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import WiCarousel from './Carousel.vue'

describe('wiCarousel', () => {
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

  it('hides arrows and shows indicators', async () => {
    const wrapper = mount(WiCarousel, {
      props: { value: ['a', 'b', 'c'], showArrows: false, showIndicators: true },
    })
    expect(wrapper.find('.wi-carousel__nav').exists()).toBe(false)
    const dots = wrapper.findAll('.wi-carousel__indicator')
    expect(dots.length).toBeGreaterThan(1)
    await dots[1]!.trigger('click')
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
  })

  it('supports controlled page via v-model:page', async () => {
    const wrapper = mount(WiCarousel, {
      props: {
        'value': ['a', 'b', 'c'],
        'numVisible': 1,
        'page': 2,
        'onUpdate:page': (page: number) => wrapper.setProps({ page }),
      },
      slots: {
        item: `<template #item="{ item }"><span class="slide">{{ item }}</span></template>`,
      },
    })
    expect(wrapper.find('.slide').text()).toBe('c')
    await wrapper.find('[aria-label="上一页"]').trigger('click')
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
    expect(wrapper.find('.slide').text()).toBe('b')
  })

  it('navigates with arrow keys', async () => {
    const wrapper = mount(WiCarousel, {
      props: { value: ['a', 'b', 'c'], numVisible: 1 },
    })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([0])
  })

  it('changes page on touch swipe', async () => {
    const wrapper = mount(WiCarousel, {
      props: { value: ['a', 'b', 'c'], numVisible: 1 },
    })
    const viewport = wrapper.find('.wi-carousel__viewport')
    await viewport.trigger('pointerdown', { isPrimary: true, pointerType: 'touch', clientX: 200 })
    await viewport.trigger('pointerup', { isPrimary: true, pointerType: 'touch', clientX: 100 })
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
    await viewport.trigger('pointerdown', { isPrimary: true, pointerType: 'touch', clientX: 100 })
    await viewport.trigger('pointerup', { isPrimary: true, pointerType: 'touch', clientX: 220 })
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([0])
  })

  it('uses semantic indicator labels', () => {
    const wrapper = mount(WiCarousel, {
      props: { value: ['a', 'b', 'c'], numVisible: 1 },
    })
    const dots = wrapper.findAll('.wi-carousel__indicator')
    expect(dots[0]!.attributes('aria-label')).toBe('第 1 页，共 3 页')
    expect(dots[2]!.attributes('aria-label')).toBe('第 3 页，共 3 页')
  })

  it('pauses autoplay on hover and resumes on leave', async () => {
    vi.useFakeTimers()
    try {
      const wrapper = mount(WiCarousel, {
        props: { value: ['a', 'b', 'c'], numVisible: 1, autoplay: true, interval: 1000 },
      })
      await wrapper.trigger('mouseenter')
      vi.advanceTimersByTime(3500)
      expect(wrapper.emitted('update:page')).toBeUndefined()
      await wrapper.trigger('mouseleave')
      vi.advanceTimersByTime(1500)
      expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
      wrapper.unmount()
    } finally {
      vi.useRealTimers()
    }
  })
})
