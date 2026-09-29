import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import MImage from './Image.vue'
import MImagePreviewGroup from './ImagePreviewGroup.vue'

describe('muImage', () => {
  it('renders img with src and alt', () => {
    const wrapper = mount(MImage, {
      props: { src: '/a.png', alt: 'Photo', preview: false },
    })
    const img = wrapper.get('img')
    expect(img.attributes('src')).toBe('/a.png')
    expect(img.attributes('alt')).toBe('Photo')
    expect(wrapper.find('.m-image__trigger').exists()).toBe(false)
  })

  it('opens local preview on click and closes on Escape', async () => {
    const wrapper = mount(MImage, {
      props: { src: '/a.png', alt: 'Photo' },
      attachTo: document.body,
    })
    await wrapper.get('.m-image__trigger').trigger('click')
    expect(wrapper.emitted('click-preview')).toHaveLength(1)
    expect(document.querySelector('.m-image-preview')).toBeTruthy()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(document.querySelector('.m-image-preview')).toBeFalsy()
    wrapper.unmount()
  })

  it('preview=false does not open overlay', async () => {
    const wrapper = mount(MImage, {
      props: { src: '/a.png', preview: false },
      attachTo: document.body,
    })
    await wrapper.get('img').trigger('click')
    expect(document.querySelector('.m-image-preview')).toBeFalsy()
    wrapper.unmount()
  })
})

describe('muImagePreviewGroup', () => {
  it('opens group preview from child image', async () => {
    const wrapper = mount(
      {
        components: { MImagePreviewGroup, MImage },
        template: `
          <MImagePreviewGroup>
            <MImage src="/a.png" />
            <MImage src="/b.png" />
          </MImagePreviewGroup>
        `,
      },
      { attachTo: document.body },
    )
    await nextTick()
    const triggers = wrapper.findAll('.m-image__trigger')
    await triggers[1]!.trigger('click')
    await nextTick()
    const preview = document.querySelector('.m-image-preview img') as HTMLImageElement | null
    expect(preview?.getAttribute('src')).toBe('/b.png')
    wrapper.unmount()
  })
})
