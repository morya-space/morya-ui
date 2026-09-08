import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkFluid from './Fluid.vue'

describe('wkFluid', () => {
  it('wraps children with fluid class', () => {
    const wrapper = mount(WkFluid, {
      slots: { default: '<input class="child" />' },
    })
    expect(wrapper.classes()).toContain('wk-fluid')
    expect(wrapper.find('.child').exists()).toBe(true)
  })
})
