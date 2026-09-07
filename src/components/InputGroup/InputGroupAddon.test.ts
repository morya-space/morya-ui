import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdInputGroupAddon from './InputGroupAddon.vue'

describe('InputGroupAddon', () => {
  it('renders addon slot content', () => {
    const wrapper = mount(RdInputGroupAddon, {
      slots: { default: '@' },
    })
    expect(wrapper.classes()).toContain('rd-inputgroup-addon')
    expect(wrapper.text()).toBe('@')
  })
})
