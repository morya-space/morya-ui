import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdAvatar from './Avatar.vue'

describe('wdAvatar', () => {
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
    const small = mount(WdAvatar, { props: { label: 'S', shape: 'square', size: 'small' } })
    const medium = mount(WdAvatar, { props: { label: 'M', size: 'medium' } })
    const xlarge = mount(WdAvatar, { props: { label: 'X', size: 'xlarge' } })
    const legacy = mount(WdAvatar, { props: { label: 'L', size: 'lg' } })
    const normal = mount(WdAvatar, { props: { label: 'N', size: 'normal' } })

    expect(small.classes()).toEqual(expect.arrayContaining(['wd-avatar--square', 'wd-avatar--small']))
    expect(medium.classes()).toContain('wd-avatar--medium')
    expect(xlarge.classes()).toContain('wd-avatar--xlarge')
    expect(legacy.classes()).toContain('wd-avatar--large')
    expect(normal.classes()).toContain('wd-avatar--medium')
  })

  it('falls back and emits error when the image fails', async () => {
    const wrapper = mount(WdAvatar, { props: { image: 'https://example.com/missing.png', label: 'AB' } })
    await wrapper.get('img').trigger('error')
    expect(wrapper.emitted('error')).toHaveLength(1)
    expect(wrapper.find('.wd-avatar__image').exists()).toBe(false)
    expect(wrapper.get('.wd-avatar__label').text()).toBe('AB')
  })
})
