import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkLabel from './Label.vue'

describe('wkLabel', () => {
  it('renders slot content and for attribute', () => {
    const wrapper = mount(WkLabel, {
      props: { htmlFor: 'email' },
      slots: { default: 'Email' },
    })
    expect(wrapper.text()).toBe('Email')
    expect(wrapper.attributes('for')).toBe('email')
    expect(wrapper.classes()).toContain('wk-label')
  })

  it('accepts for prop alias', () => {
    const wrapper = mount(WkLabel, { props: { for: 'name' }, slots: { default: 'Name' } })
    expect(wrapper.attributes('for')).toBe('name')
  })
})
