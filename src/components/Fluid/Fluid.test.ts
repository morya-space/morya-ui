import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdFluid from './Fluid.vue'

describe('rdFluid', () => {
  it('wraps children with fluid class', () => {
    const wrapper = mount(RdFluid, {
      slots: { default: '<input class="child" />' },
    })
    expect(wrapper.classes()).toContain('rd-fluid')
    expect(wrapper.find('.child').exists()).toBe(true)
  })
})
