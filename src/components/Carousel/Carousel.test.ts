import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import MCarousel from './Carousel.vue'
import MCarouselItem from './CarouselItem.vue'

function Slide(label: string) {
  return h(MCarouselItem, null, () => label)
}

function mountCarousel(props: Record<string, unknown> = {}, slideCount = 3) {
  return mount(MCarousel, {
    props,
    slots: {
      default: () =>
        Array.from({ length: slideCount }, (_, index) =>
          Slide(String.fromCharCode(97 + index)),
        ),
    },
    attachTo: document.body,
  })
}

describe('MCarousel', () => {
  it('renders slides and pages with arrows', async () => {
    const wrapper = mountCarousel({ showArrow: true, loop: false })
    expect(wrapper.text()).toContain('a')
    expect(wrapper.findAll('.m-carousel__slide')).toHaveLength(3)
    await wrapper.find('[aria-label="下一页"]').trigger('click')
    expect(wrapper.emitted('update:currentIndex')?.at(-1)?.[0]).toBe(1)
    wrapper.unmount()
  })

  it('loops by default', async () => {
    const wrapper = mountCarousel({ showArrow: true })
    await wrapper.find('[aria-label="上一页"]').trigger('click')
    expect(wrapper.emitted('update:currentIndex')?.at(-1)?.[0]).toBe(2)
    wrapper.unmount()
  })

  it('supports controlled currentIndex', async () => {
    const wrapper = mountCarousel({
      currentIndex: 1,
      showArrow: true,
      'onUpdate:currentIndex': (index: number) => wrapper.setProps({ currentIndex: index }),
    })
    expect((wrapper.vm as unknown as { getCurrentIndex: () => number }).getCurrentIndex()).toBe(1)
    await wrapper.find('[aria-label="上一页"]').trigger('click')
    expect(wrapper.emitted('update:currentIndex')?.at(-1)?.[0]).toBe(0)
    wrapper.unmount()
  })

  it('activates dots by click and hover trigger', async () => {
    const clickable = mountCarousel({ showDots: true })
    const dots = clickable.findAll('.m-carousel__dot')
    expect(dots).toHaveLength(3)
    expect(dots[0]!.attributes('aria-label')).toBe('第 1 页，共 3 页')
    await dots[2]!.trigger('click')
    expect(clickable.emitted('update:currentIndex')?.at(-1)?.[0]).toBe(2)
    clickable.unmount()

    const hoverable = mountCarousel({ showDots: true, trigger: 'hover' })
    await hoverable.findAll('.m-carousel__dot')[1]!.trigger('mouseenter')
    expect(hoverable.emitted('update:currentIndex')?.at(-1)?.[0]).toBe(1)
    hoverable.unmount()
  })

  it('exposes prev/next/to methods', async () => {
    const wrapper = mountCarousel({ loop: false })
    const api = wrapper.vm as unknown as {
      next: () => void
      prev: () => void
      to: (index: number) => void
      getCurrentIndex: () => number
    }
    api.next()
    await nextTick()
    expect(api.getCurrentIndex()).toBe(1)
    api.to(2)
    await nextTick()
    expect(api.getCurrentIndex()).toBe(2)
    api.prev()
    await nextTick()
    expect(api.getCurrentIndex()).toBe(1)
    wrapper.unmount()
  })

  it('supports fade effect classes', () => {
    const wrapper = mountCarousel({ effect: 'fade' })
    expect(wrapper.classes()).toContain('m-carousel--fade')
    expect(wrapper.find('.m-carousel__slide--current').exists()).toBe(true)
    wrapper.unmount()
  })

  it('navigates with keyboard when enabled', async () => {
    const wrapper = mountCarousel({ keyboard: true, loop: false })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:currentIndex')?.at(-1)?.[0]).toBe(1)
    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:currentIndex')?.at(-1)?.[0]).toBe(0)
    wrapper.unmount()
  })

  it('changes page on touch swipe when touchable', async () => {
    const wrapper = mountCarousel({ touchable: true, loop: false })
    const viewport = wrapper.find('.m-carousel__viewport')
    await viewport.trigger('pointerdown', {
      isPrimary: true,
      pointerType: 'touch',
      clientX: 200,
      clientY: 0,
    })
    window.dispatchEvent(
      new PointerEvent('pointermove', {
        isPrimary: true,
        clientX: 100,
        clientY: 0,
        bubbles: true,
      }),
    )
    window.dispatchEvent(
      new PointerEvent('pointerup', {
        isPrimary: true,
        clientX: 100,
        clientY: 0,
        bubbles: true,
      }),
    )
    await nextTick()
    expect(wrapper.emitted('update:currentIndex')?.at(-1)?.[0]).toBe(1)
    wrapper.unmount()
  })

  it('pauses autoplay on hover and resumes on leave', async () => {
    vi.useFakeTimers()
    try {
      const wrapper = mountCarousel({ autoplay: true, interval: 1000, loop: true })
      await wrapper.trigger('mouseenter')
      vi.advanceTimersByTime(3500)
      expect(wrapper.emitted('update:currentIndex')).toBeUndefined()
      await wrapper.trigger('mouseleave')
      vi.advanceTimersByTime(1500)
      expect(wrapper.emitted('update:currentIndex')?.at(-1)?.[0]).toBe(1)
      wrapper.unmount()
    }
    finally {
      vi.useRealTimers()
    }
  })

  it('hides arrows/dots when disabled or single page', () => {
    const hidden = mountCarousel({ showArrow: false, showDots: false })
    expect(hidden.find('.m-carousel__arrow').exists()).toBe(false)
    expect(hidden.find('.m-carousel__dot').exists()).toBe(false)
    hidden.unmount()

    const single = mountCarousel({ showArrow: true, showDots: true }, 1)
    expect(single.find('.m-carousel__arrow').exists()).toBe(false)
    expect(single.find('.m-carousel__dot').exists()).toBe(false)
    single.unmount()
  })
})
