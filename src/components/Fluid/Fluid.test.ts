import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdFluid from './Fluid.vue'

describe('wdFluid', () => {
  it('wraps children with fluid class', () => {
    const wrapper = mount(WdFluid, {
      slots: { default: '<input class="child" />' },
    })
    expect(wrapper.classes()).toContain('wd-fluid')
    expect(wrapper.find('.child').exists()).toBe(true)
  })
})
