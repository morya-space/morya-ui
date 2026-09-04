import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdLabel from './Label.vue'

describe('wdLabel', () => {
  it('renders slot content and for attribute', () => {
    const wrapper = mount(WdLabel, {
      props: { htmlFor: 'email' },
      slots: { default: 'Email' },
    })
    expect(wrapper.text()).toBe('Email')
    expect(wrapper.attributes('for')).toBe('email')
    expect(wrapper.classes()).toContain('wd-label')
  })

  it('accepts for prop alias', () => {
    const wrapper = mount(WdLabel, { props: { for: 'name' }, slots: { default: 'Name' } })
    expect(wrapper.attributes('for')).toBe('name')
  })
})
