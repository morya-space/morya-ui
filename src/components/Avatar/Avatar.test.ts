import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdAvatar from './Avatar.vue'

describe('rdAvatar', () => {
  it('renders label with default circle shape', () => {
    const wrapper = mount(RdAvatar, { props: { label: 'AB' } })
    expect(wrapper.find('.rd-avatar__label').text()).toBe('AB')
    expect(wrapper.classes()).toContain('rd-avatar--circle')
  })

  it('prefers image over icon and label', () => {
    const wrapper = mount(RdAvatar, {
      props: { image: 'https://example.com/a.png', icon: 'check', label: 'AB' },
    })
    expect(wrapper.find('.rd-avatar__image').exists()).toBe(true)
    expect(wrapper.find('.rd-avatar__icon').exists()).toBe(false)
    expect(wrapper.find('.rd-avatar__label').exists()).toBe(false)
  })

  it('renders icon over label when image is absent', () => {
    const wrapper = mount(RdAvatar, { props: { icon: 'check', label: 'AB' } })
    expect(wrapper.find('.rd-avatar__icon').exists()).toBe(true)
    expect(wrapper.find('.rd-icon').exists()).toBe(true)
    expect(wrapper.find('.rd-avatar__label').exists()).toBe(false)
  })

  it('applies shape and size modifiers including aliases', () => {
    const small = mount(RdAvatar, { props: { label: 'S', shape: 'square', size: 'small' } })
    const medium = mount(RdAvatar, { props: { label: 'M', size: 'medium' } })
    const xlarge = mount(RdAvatar, { props: { label: 'X', size: 'xlarge' } })
    const legacy = mount(RdAvatar, { props: { label: 'L', size: 'lg' } })
    const normal = mount(RdAvatar, { props: { label: 'N', size: 'normal' } })

    expect(small.classes()).toEqual(expect.arrayContaining(['rd-avatar--square', 'rd-avatar--small']))
    expect(medium.classes()).toContain('rd-avatar--medium')
    expect(xlarge.classes()).toContain('rd-avatar--xlarge')
    expect(legacy.classes()).toContain('rd-avatar--large')
    expect(normal.classes()).toContain('rd-avatar--medium')
  })

  it('falls back and emits error when the image fails', async () => {
    const wrapper = mount(RdAvatar, { props: { image: 'https://example.com/missing.png', label: 'AB' } })
    await wrapper.get('img').trigger('error')
    expect(wrapper.emitted('error')).toHaveLength(1)
    expect(wrapper.find('.rd-avatar__image').exists()).toBe(false)
    expect(wrapper.get('.rd-avatar__label').text()).toBe('AB')
  })
})
