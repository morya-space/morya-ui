import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MLabel from './Label.vue'

describe('muLabel', () => {
  it('renders slot content and for attribute', () => {
    const wrapper = mount(MLabel, {
      props: { htmlFor: 'email' },
      slots: { default: 'Email' },
    })
    expect(wrapper.text()).toBe('Email')
    expect(wrapper.attributes('for')).toBe('email')
    expect(wrapper.classes()).toContain('m-label')
  })

  it('accepts for prop alias', () => {
    const wrapper = mount(MLabel, { props: { for: 'name' }, slots: { default: 'Name' } })
    expect(wrapper.attributes('for')).toBe('name')
  })
})
