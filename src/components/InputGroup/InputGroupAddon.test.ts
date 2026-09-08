import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkInputGroupAddon from './InputGroupAddon.vue'

describe('InputGroupAddon', () => {
  it('renders addon slot content', () => {
    const wrapper = mount(WkInputGroupAddon, {
      slots: { default: '@' },
    })
    expect(wrapper.classes()).toContain('wk-inputgroup-addon')
    expect(wrapper.text()).toBe('@')
  })
})
