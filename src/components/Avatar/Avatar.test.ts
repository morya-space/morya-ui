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
    const square = mount(WiAvatar, { props: { label: 'S', shape: 'square', size: 'large' } })
    const xlarge = mount(WiAvatar, { props: { label: 'X', size: 'xlarge' } })
    const lg = mount(WiAvatar, { props: { label: 'L', size: 'lg' } })

    expect(square.classes()).toEqual(expect.arrayContaining(['wi-avatar--square', 'wi-avatar--large']))
    expect(xlarge.classes()).toContain('wi-avatar--xlarge')
    expect(lg.classes()).toContain('wi-avatar--large')
  })

  it('falls back and emits error when the image fails', async () => {
    const wrapper = mount(WiAvatar, { props: { image: 'https://example.com/missing.png', label: 'AB' } })
    await wrapper.get('img').trigger('error')
    expect(wrapper.emitted('error')).toHaveLength(1)
    expect(wrapper.find('.wi-avatar__image').exists()).toBe(false)
    expect(wrapper.get('.wi-avatar__label').text()).toBe('AB')
  })
})
