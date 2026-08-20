import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiFluid from './Fluid.vue'

describe('WiFluid', () => {
  it('wraps children with fluid class', () => {
    const wrapper = mount(WiFluid, {
      slots: { default: '<input class="child" />' },
    })
    expect(wrapper.classes()).toContain('wi-fluid')
    expect(wrapper.find('.child').exists()).toBe(true)
  })
})
