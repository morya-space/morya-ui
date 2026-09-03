import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WiGallery from './Gallery.vue'

const images = [
  'https://example.com/a.jpg',
  'https://example.com/b.jpg',
  'https://example.com/c.jpg',
]

describe('wiGallery', () => {
  it('changes active image via thumb and nav', async () => {
    const wrapper = mount(WiGallery, { props: { images, activeIndex: 0 } })
    await wrapper.findAll('.wi-gallery__thumb')[2]!.trigger('click')
    expect(wrapper.emitted('update:activeIndex')?.at(-1)).toEqual([2])
    await wrapper.setProps({ activeIndex: 2 })
    await wrapper.find('[aria-label="上一张"]').trigger('click')
    expect(wrapper.emitted('update:activeIndex')?.at(-1)).toEqual([1])
  })

  it('renders object images with alt and caption', () => {
    const wrapper = mount(WiGallery, {
      props: {
        images: [{ src: 'https://example.com/a.jpg', alt: 'A photo', caption: 'First' }],
        activeIndex: 0,
      },
    })
    expect(wrapper.find('.wi-gallery__image').attributes('alt')).toBe('A photo')
    expect(wrapper.find('.wi-gallery__caption').text()).toBe('First')
    expect(wrapper.find('.wi-gallery__thumb img').attributes('alt')).toBe('A photo')
  })

  it('supports arrow-key navigation across thumbs with roving tabindex', async () => {
    const wrapper = mount(WiGallery, {
      attachTo: document.body,
      props: { images, activeIndex: 0 },
    })
    const thumbs = () => wrapper.findAll('.wi-gallery__thumb')
    expect(thumbs()[0]!.attributes('tabindex')).toBe('0')
    expect(thumbs()[1]!.attributes('tabindex')).toBe('-1')

    ;(thumbs()[0]!.element as HTMLElement).focus()
    await wrapper.find('.wi-gallery__thumbs').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.emitted('update:activeIndex')?.at(-1)).toEqual([1])
    expect(thumbs()[1]!.attributes('tabindex')).toBe('0')
    expect(document.activeElement).toBe(thumbs()[1]!.element)
    wrapper.unmount()
  })
})
