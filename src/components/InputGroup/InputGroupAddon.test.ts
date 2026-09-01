import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiInputGroupAddon from './InputGroupAddon.vue'

describe('InputGroupAddon', () => {
  it('renders addon slot content', () => {
    const wrapper = mount(WiInputGroupAddon, {
      slots: { default: '@' },
    })
    expect(wrapper.classes()).toContain('wi-inputgroup-addon')
    expect(wrapper.text()).toBe('@')
  })
})
