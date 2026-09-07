import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdLabel from './Label.vue'

describe('rdLabel', () => {
  it('renders slot content and for attribute', () => {
    const wrapper = mount(RdLabel, {
      props: { htmlFor: 'email' },
      slots: { default: 'Email' },
    })
    expect(wrapper.text()).toBe('Email')
    expect(wrapper.attributes('for')).toBe('email')
    expect(wrapper.classes()).toContain('rd-label')
  })

  it('accepts for prop alias', () => {
    const wrapper = mount(RdLabel, { props: { for: 'name' }, slots: { default: 'Name' } })
    expect(wrapper.attributes('for')).toBe('name')
  })
})
