import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdGallery from './Gallery.vue'

const images = [
  'https://example.com/a.jpg',
  'https://example.com/b.jpg',
  'https://example.com/c.jpg',
]

describe('WdGallery', () => {
  it('changes active image via thumb and nav', async () => {
    const wrapper = mount(WdGallery, { props: { images, activeIndex: 0 } })
    await wrapper.findAll('.wd-gallery__thumb')[2]!.trigger('click')
    expect(wrapper.emitted('update:activeIndex')?.at(-1)).toEqual([2])
    await wrapper.setProps({ activeIndex: 2 })
    await wrapper.find('[aria-label="上一张"]').trigger('click')
    expect(wrapper.emitted('update:activeIndex')?.at(-1)).toEqual([1])
  })
})
