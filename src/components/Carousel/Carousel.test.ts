import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import MCarousel from './Carousel.vue'

function trackPage(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('.m-carousel__track').attributes('style') ?? ''
}

describe('muCarousel', () => {
  it('pages through items', async () => {
    const wrapper = mount(MCarousel, {
      props: { value: ['a', 'b', 'c'], numVisible: 1 },
      slots: {
        item: `<template #item="{ item }"><span class="slide">{{ item }}</span></template>`,
      },
    })
    expect(trackPage(wrapper)).toContain('--m-carousel-page: 0')
    expect(wrapper.findAll('.slide').map((node) => node.text())).toEqual(['a', 'b', 'c'])
    await wrapper.find('[aria-label="下一页"]').trigger('click')
    expect(trackPage(wrapper)).toContain('--m-carousel-page: 1')
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
  })

  it('wraps when circular', async () => {
    const wrapper = mount(MCarousel, {
      props: { value: ['a', 'b'], numVisible: 1, circular: true },
    })
    await wrapper.find('[aria-label="上一页"]').trigger('click')
    expect(trackPage(wrapper)).toContain('--m-carousel-page: 1')
    expect(wrapper.text()).toContain('b')
  })

  it('hides arrows and shows indicators', async () => {
    const wrapper = mount(MCarousel, {
      props: { value: ['a', 'b', 'c'], showArrows: false, showIndicators: true },
    })
    expect(wrapper.find('.m-carousel__nav').exists()).toBe(false)
    const dots = wrapper.findAll('.m-carousel__indicator')
    expect(dots.length).toBeGreaterThan(1)
    await dots[1]!.trigger('click')
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
  })

  it('supports controlled page via v-model:page', async () => {
    const wrapper = mount(MCarousel, {
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
    expect(trackPage(wrapper)).toContain('--m-carousel-page: 2')
    await wrapper.find('[aria-label="上一页"]').trigger('click')
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
    expect(trackPage(wrapper)).toContain('--m-carousel-page: 1')
  })

  it('navigates with arrow keys', async () => {
    const wrapper = mount(MCarousel, {
      props: { value: ['a', 'b', 'c'], numVisible: 1 },
    })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([0])
  })

  it('changes page on touch swipe', async () => {
    const wrapper = mount(MCarousel, {
      props: { value: ['a', 'b', 'c'], numVisible: 1 },
    })
    const viewport = wrapper.find('.m-carousel__viewport')
    await viewport.trigger('pointerdown', { isPrimary: true, pointerType: 'touch', clientX: 200 })
    await viewport.trigger('pointerup', { isPrimary: true, pointerType: 'touch', clientX: 100 })
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
    await viewport.trigger('pointerdown', { isPrimary: true, pointerType: 'touch', clientX: 100 })
    await viewport.trigger('pointerup', { isPrimary: true, pointerType: 'touch', clientX: 220 })
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([0])
  })

  it('uses semantic indicator labels', () => {
    const wrapper = mount(MCarousel, {
      props: { value: ['a', 'b', 'c'], numVisible: 1 },
    })
    const dots = wrapper.findAll('.m-carousel__indicator')
    expect(dots[0]!.attributes('aria-label')).toBe('第 1 页，共 3 页')
    expect(dots[2]!.attributes('aria-label')).toBe('第 3 页，共 3 页')
  })

  it('pauses autoplay on hover and resumes on leave', async () => {
    vi.useFakeTimers()
    try {
      const wrapper = mount(MCarousel, {
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
