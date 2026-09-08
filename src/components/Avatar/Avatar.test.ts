import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkAvatar from './Avatar.vue'

describe('wkAvatar', () => {
  it('renders label with default circle shape', () => {
    const wrapper = mount(WkAvatar, { props: { label: 'AB' } })
    expect(wrapper.find('.wk-avatar__label').text()).toBe('AB')
    expect(wrapper.classes()).toContain('wk-avatar--circle')
  })

  it('prefers image over icon and label', () => {
    const wrapper = mount(WkAvatar, {
      props: { image: 'https://example.com/a.png', icon: 'check', label: 'AB' },
    })
    expect(wrapper.find('.wk-avatar__image').exists()).toBe(true)
    expect(wrapper.find('.wk-avatar__icon').exists()).toBe(false)
    expect(wrapper.find('.wk-avatar__label').exists()).toBe(false)
  })

  it('renders icon over label when image is absent', () => {
    const wrapper = mount(WkAvatar, { props: { icon: 'check', label: 'AB' } })
    expect(wrapper.find('.wk-avatar__icon').exists()).toBe(true)
    expect(wrapper.find('.wk-icon').exists()).toBe(true)
    expect(wrapper.find('.wk-avatar__label').exists()).toBe(false)
  })

  it('applies shape and size modifiers including aliases', () => {
    const small = mount(WkAvatar, { props: { label: 'S', shape: 'square', size: 'small' } })
    const medium = mount(WkAvatar, { props: { label: 'M', size: 'medium' } })
    const xlarge = mount(WkAvatar, { props: { label: 'X', size: 'xlarge' } })
    const legacy = mount(WkAvatar, { props: { label: 'L', size: 'lg' } })
    const normal = mount(WkAvatar, { props: { label: 'N', size: 'normal' } })

    expect(small.classes()).toEqual(expect.arrayContaining(['wk-avatar--square', 'wk-avatar--small']))
    expect(medium.classes()).toContain('wk-avatar--medium')
    expect(xlarge.classes()).toContain('wk-avatar--xlarge')
    expect(legacy.classes()).toContain('wk-avatar--large')
    expect(normal.classes()).toContain('wk-avatar--medium')
  })

  it('falls back and emits error when the image fails', async () => {
    const wrapper = mount(WkAvatar, { props: { image: 'https://example.com/missing.png', label: 'AB' } })
    await wrapper.get('img').trigger('error')
    expect(wrapper.emitted('error')).toHaveLength(1)
    expect(wrapper.find('.wk-avatar__image').exists()).toBe(false)
    expect(wrapper.get('.wk-avatar__label').text()).toBe('AB')
  })
})
