import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiLabel from './Label.vue'

describe('wiLabel', () => {
  it('renders slot content and for attribute', () => {
    const wrapper = mount(WiLabel, {
      props: { htmlFor: 'email' },
      slots: { default: 'Email' },
    })
    expect(wrapper.text()).toBe('Email')
    expect(wrapper.attributes('for')).toBe('email')
    expect(wrapper.classes()).toContain('wi-label')
  })

  it('accepts for prop alias', () => {
    const wrapper = mount(WiLabel, { props: { for: 'name' }, slots: { default: 'Name' } })
    expect(wrapper.attributes('for')).toBe('name')
  })
})
