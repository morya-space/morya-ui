import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdAvatar from './Avatar.vue'

describe('WdAvatar', () => {
  it('renders label with default circle shape', () => {
    const wrapper = mount(WdAvatar, { props: { label: 'AB' } })
    expect(wrapper.find('.wd-avatar__label').text()).toBe('AB')
    expect(wrapper.classes()).toContain('wd-avatar--circle')
  })

  it('prefers image over icon and label', () => {
    const wrapper = mount(WdAvatar, {
      props: { image: 'https://example.com/a.png', icon: 'check', label: 'AB' },
    })
    expect(wrapper.find('.wd-avatar__image').exists()).toBe(true)
    expect(wrapper.find('.wd-avatar__icon').exists()).toBe(false)
    expect(wrapper.find('.wd-avatar__label').exists()).toBe(false)
  })

  it('renders icon over label when image is absent', () => {
    const wrapper = mount(WdAvatar, { props: { icon: 'check', label: 'AB' } })
    expect(wrapper.find('.wd-avatar__icon').exists()).toBe(true)
    expect(wrapper.find('.wd-icon').exists()).toBe(true)
    expect(wrapper.find('.wd-avatar__label').exists()).toBe(false)
  })

  it('applies shape and size modifiers including aliases', () => {
    const square = mount(WdAvatar, { props: { label: 'S', shape: 'square', size: 'large' } })
    const xlarge = mount(WdAvatar, { props: { label: 'X', size: 'xlarge' } })
    const lg = mount(WdAvatar, { props: { label: 'L', size: 'lg' } })

    expect(square.classes()).toEqual(expect.arrayContaining(['wd-avatar--square', 'wd-avatar--large']))
    expect(xlarge.classes()).toContain('wd-avatar--xlarge')
    expect(lg.classes()).toContain('wd-avatar--large')
  })
})
