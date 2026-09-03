import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiAvatar from './Avatar.vue'

describe('wiAvatar', () => {
  it('renders label with default circle shape', () => {
    const wrapper = mount(WiAvatar, { props: { label: 'AB' } })
    expect(wrapper.find('.wi-avatar__label').text()).toBe('AB')
    expect(wrapper.classes()).toContain('wi-avatar--circle')
  })

  it('prefers image over icon and label', () => {
    const wrapper = mount(WiAvatar, {
      props: { image: 'https://example.com/a.png', icon: 'check', label: 'AB' },
    })
    expect(wrapper.find('.wi-avatar__image').exists()).toBe(true)
    expect(wrapper.find('.wi-avatar__icon').exists()).toBe(false)
    expect(wrapper.find('.wi-avatar__label').exists()).toBe(false)
  })

  it('renders icon over label when image is absent', () => {
    const wrapper = mount(WiAvatar, { props: { icon: 'check', label: 'AB' } })
    expect(wrapper.find('.wi-avatar__icon').exists()).toBe(true)
    expect(wrapper.find('.wi-icon').exists()).toBe(true)
    expect(wrapper.find('.wi-avatar__label').exists()).toBe(false)
  })

  it('applies shape and size modifiers including aliases', () => {
    const small = mount(WiAvatar, { props: { label: 'S', shape: 'square', size: 'small' } })
    const medium = mount(WiAvatar, { props: { label: 'M', size: 'medium' } })
    const xlarge = mount(WiAvatar, { props: { label: 'X', size: 'xlarge' } })
    const legacy = mount(WiAvatar, { props: { label: 'L', size: 'lg' } })
    const normal = mount(WiAvatar, { props: { label: 'N', size: 'normal' } })

    expect(small.classes()).toEqual(expect.arrayContaining(['wi-avatar--square', 'wi-avatar--small']))
    expect(medium.classes()).toContain('wi-avatar--medium')
    expect(xlarge.classes()).toContain('wi-avatar--xlarge')
    expect(legacy.classes()).toContain('wi-avatar--large')
    expect(normal.classes()).toContain('wi-avatar--medium')
  })

  it('falls back and emits error when the image fails', async () => {
    const wrapper = mount(WiAvatar, { props: { image: 'https://example.com/missing.png', label: 'AB' } })
    await wrapper.get('img').trigger('error')
    expect(wrapper.emitted('error')).toHaveLength(1)
    expect(wrapper.find('.wi-avatar__image').exists()).toBe(false)
    expect(wrapper.get('.wi-avatar__label').text()).toBe('AB')
  })
})
