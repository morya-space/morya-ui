import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdProgressSpinner from './ProgressSpinner.vue'

describe('WdProgressSpinner', () => {
  it('renders SVG circle with defaults', () => {
    const wrapper = mount(WdProgressSpinner)
    expect(wrapper.classes()).toContain('wd-progress-spinner')
    expect(wrapper.find('.wd-progress-spinner__circle').exists()).toBe(true)
    expect(wrapper.attributes('aria-label')).toBe('加载中')
    expect(wrapper.find('circle').attributes('stroke-width')).toBe('2')
  })

  it('applies strokeWidth and animationDuration', () => {
    const wrapper = mount(WdProgressSpinner, {
      props: { strokeWidth: '4', animationDuration: '2s', ariaLabel: 'Loading' },
    })
    expect(wrapper.find('circle').attributes('stroke-width')).toBe('4')
    expect(wrapper.attributes('style')).toContain('animation-duration: 2s')
    expect(wrapper.attributes('aria-label')).toBe('Loading')
  })
})
