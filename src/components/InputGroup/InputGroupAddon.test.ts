import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdInputGroupAddon from './InputGroupAddon.vue'

describe('InputGroupAddon', () => {
  it('renders addon slot content', () => {
    const wrapper = mount(WdInputGroupAddon, {
      slots: { default: '@' },
    })
    expect(wrapper.classes()).toContain('wd-inputgroup-addon')
    expect(wrapper.text()).toBe('@')
  })
})
