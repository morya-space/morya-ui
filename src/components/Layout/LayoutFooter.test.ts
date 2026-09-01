import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiLayoutFooter from './LayoutFooter.vue'

describe('LayoutFooter', () => {
  it('renders footer slot without border by default', () => {
    const wrapper = mount(WiLayoutFooter, {
      slots: { default: '© App' },
    })
    expect(wrapper.text()).toBe('© App')
    expect(wrapper.classes()).not.toContain('wi-layout-footer--bordered')
  })

  it('supports custom height and padding', () => {
    const wrapper = mount(WiLayoutFooter, {
      props: { height: 48, padding: 8, bordered: false },
    })
    expect(wrapper.element.style.height).toBe('48px')
    expect(wrapper.element.style.padding).toBe('8px')
  })
})
