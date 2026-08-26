import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiProgressSpinner from './ProgressSpinner.vue'

describe('WiProgressSpinner', () => {
  it('renders SVG circle with defaults', () => {
    const wrapper = mount(WiProgressSpinner)
    expect(wrapper.classes()).toContain('wi-progress-spinner')
    expect(wrapper.find('.wi-progress-spinner__circle').exists()).toBe(true)
    expect(wrapper.attributes('aria-label')).toBe('加载中')
    expect(wrapper.find('circle').attributes('stroke-width')).toBe('2')
  })

  it('applies strokeWidth and animationDuration', () => {
    const wrapper = mount(WiProgressSpinner, {
      props: { strokeWidth: '4', animationDuration: '2s', ariaLabel: 'Loading' },
    })
    expect(wrapper.find('circle').attributes('stroke-width')).toBe('4')
    expect(wrapper.attributes('style')).toContain('animation-duration: 2s')
    expect(wrapper.attributes('aria-label')).toBe('Loading')
  })

  it('wraps content and respects show', () => {
    const hidden = mount(WiProgressSpinner, {
      props: { show: false, description: 'Saving' },
      slots: { default: '<p>Form</p>' },
    })
    expect(hidden.text()).toContain('Form')
    expect(hidden.find('.wi-progress-spinner-wrap__overlay').exists()).toBe(false)

    const shown = mount(WiProgressSpinner, {
      props: { show: true, description: 'Saving' },
      slots: { default: '<p>Form</p>' },
    })
    expect(shown.get('.wi-progress-spinner-wrap__overlay').text()).toContain('Saving')
  })
})
