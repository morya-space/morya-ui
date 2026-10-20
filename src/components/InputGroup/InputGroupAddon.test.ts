import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MInputGroupAddon from './InputGroupAddon.vue'

describe('inputGroupAddon', () => {
  it('renders addon slot content', () => {
    const wrapper = mount(MInputGroupAddon, {
      slots: { default: '@' },
    })
    expect(wrapper.classes()).toContain('m-input-group-addon')
    expect(wrapper.text()).toBe('@')
  })
})
