import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdProgressSpinner from './ProgressSpinner.vue'

describe('rdProgressSpinner', () => {
  it('renders SVG circle with defaults', () => {
    const wrapper = mount(RdProgressSpinner)
    expect(wrapper.classes()).toContain('rd-progress-spinner')
    expect(wrapper.find('.rd-progress-spinner__circle').exists()).toBe(true)
    expect(wrapper.attributes('aria-label')).toBe('加载中')
    expect(wrapper.find('circle').attributes('stroke-width')).toBe('2')
  })

  it('applies strokeWidth and animationDuration', () => {
    const wrapper = mount(RdProgressSpinner, {
      props: { strokeWidth: '4', animationDuration: '2s', ariaLabel: 'Loading' },
    })
    expect(wrapper.find('circle').attributes('stroke-width')).toBe('4')
    expect(wrapper.attributes('style')).toContain('animation-duration: 2s')
    expect(wrapper.attributes('aria-label')).toBe('Loading')
  })

  it('wraps content and respects show', () => {
    const hidden = mount(RdProgressSpinner, {
      props: { show: false, description: 'Saving' },
      slots: { default: '<p>Form</p>' },
    })
    expect(hidden.text()).toContain('Form')
    expect(hidden.find('.rd-progress-spinner-wrap__overlay').exists()).toBe(false)

    const shown = mount(RdProgressSpinner, {
      props: { show: true, description: 'Saving' },
      slots: { default: '<p>Form</p>' },
    })
    expect(shown.get('.rd-progress-spinner-wrap__overlay').text()).toContain('Saving')
  })

  it('marks wrapped content inert while loading overlay is visible', () => {
    const wrapper = mount(RdProgressSpinner, {
      props: { show: true },
      slots: { default: '<button type="button">Save</button>' },
    })
    expect(wrapper.get('.rd-progress-spinner-wrap__content').attributes('inert')).toBeDefined()
    expect(wrapper.get('.rd-progress-spinner-wrap').attributes('aria-busy')).toBe('true')
  })
})
