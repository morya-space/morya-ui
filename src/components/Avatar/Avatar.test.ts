import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MAvatar from './Avatar.vue'

describe('muAvatar', () => {
  it('renders label with default circle shape', () => {
    const wrapper = mount(MAvatar, { props: { label: 'AB' } })
    expect(wrapper.find('.m-avatar__label').text()).toBe('AB')
    expect(wrapper.classes()).toContain('m-avatar--circle')
  })

  it('prefers image over icon and label', () => {
    const wrapper = mount(MAvatar, {
      props: { image: 'https://example.com/a.png', icon: 'check', label: 'AB' },
    })
    expect(wrapper.find('.m-avatar__image').exists()).toBe(true)
    expect(wrapper.find('.m-avatar__icon').exists()).toBe(false)
    expect(wrapper.find('.m-avatar__label').exists()).toBe(false)
  })

  it('renders icon over label when image is absent', () => {
    const wrapper = mount(MAvatar, { props: { icon: 'check', label: 'AB' } })
    expect(wrapper.find('.m-avatar__icon').exists()).toBe(true)
    expect(wrapper.find('.m-icon').exists()).toBe(true)
    expect(wrapper.find('.m-avatar__label').exists()).toBe(false)
  })

  it('applies shape and size modifiers including aliases', () => {
    const small = mount(MAvatar, { props: { label: 'S', shape: 'square', size: 'small' } })
    const medium = mount(MAvatar, { props: { label: 'M', size: 'medium' } })
    const xlarge = mount(MAvatar, { props: { label: 'X', size: 'xlarge' } })
    const legacy = mount(MAvatar, { props: { label: 'L', size: 'lg' } })
    const normal = mount(MAvatar, { props: { label: 'N', size: 'normal' } })

    expect(small.classes()).toEqual(expect.arrayContaining(['m-avatar--square', 'm-avatar--small']))
    expect(medium.classes()).toContain('m-avatar--medium')
    expect(xlarge.classes()).toContain('m-avatar--xlarge')
    expect(legacy.classes()).toContain('m-avatar--large')
    expect(normal.classes()).toContain('m-avatar--medium')
  })

  it('falls back and emits error when the image fails', async () => {
    const wrapper = mount(MAvatar, { props: { image: 'https://example.com/missing.png', label: 'AB' } })
    await wrapper.get('img').trigger('error')
    expect(wrapper.emitted('error')).toHaveLength(1)
    expect(wrapper.find('.m-avatar__image').exists()).toBe(false)
    expect(wrapper.get('.m-avatar__label').text()).toBe('AB')
  })
})
