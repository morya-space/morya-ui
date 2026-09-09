import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MFluid from './Fluid.vue'

describe('muFluid', () => {
  it('wraps children with fluid class', () => {
    const wrapper = mount(MFluid, {
      slots: { default: '<input class="child" />' },
    })
    expect(wrapper.classes()).toContain('m-fluid')
    expect(wrapper.find('.child').exists()).toBe(true)
  })
})
