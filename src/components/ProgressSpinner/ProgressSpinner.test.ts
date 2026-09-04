import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdProgressSpinner from './ProgressSpinner.vue'

describe('wdProgressSpinner', () => {
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

  it('wraps content and respects show', () => {
    const hidden = mount(WdProgressSpinner, {
      props: { show: false, description: 'Saving' },
      slots: { default: '<p>Form</p>' },
    })
    expect(hidden.text()).toContain('Form')
    expect(hidden.find('.wd-progress-spinner-wrap__overlay').exists()).toBe(false)

    const shown = mount(WdProgressSpinner, {
      props: { show: true, description: 'Saving' },
      slots: { default: '<p>Form</p>' },
    })
    expect(shown.get('.wd-progress-spinner-wrap__overlay').text()).toContain('Saving')
  })

  it('marks wrapped content inert while loading overlay is visible', () => {
    const wrapper = mount(WdProgressSpinner, {
      props: { show: true },
      slots: { default: '<button type="button">Save</button>' },
    })
    expect(wrapper.get('.wd-progress-spinner-wrap__content').attributes('inert')).toBeDefined()
    expect(wrapper.get('.wd-progress-spinner-wrap').attributes('aria-busy')).toBe('true')
  })
})
