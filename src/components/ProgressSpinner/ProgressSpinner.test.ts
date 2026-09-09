import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MProgressSpinner from './ProgressSpinner.vue'

describe('muProgressSpinner', () => {
  it('renders SVG circle with defaults', () => {
    const wrapper = mount(MProgressSpinner)
    expect(wrapper.classes()).toContain('m-progress-spinner')
    expect(wrapper.find('.m-progress-spinner__circle').exists()).toBe(true)
    expect(wrapper.attributes('aria-label')).toBe('加载中')
    expect(wrapper.find('circle').attributes('stroke-width')).toBe('2')
  })

  it('applies strokeWidth and animationDuration', () => {
    const wrapper = mount(MProgressSpinner, {
      props: { strokeWidth: '4', animationDuration: '2s', ariaLabel: 'Loading' },
    })
    expect(wrapper.find('circle').attributes('stroke-width')).toBe('4')
    expect(wrapper.attributes('style')).toContain('animation-duration: 2s')
    expect(wrapper.attributes('aria-label')).toBe('Loading')
  })

  it('wraps content and respects show', () => {
    const hidden = mount(MProgressSpinner, {
      props: { show: false, description: 'Saving' },
      slots: { default: '<p>Form</p>' },
    })
    expect(hidden.text()).toContain('Form')
    expect(hidden.find('.m-progress-spinner-wrap__overlay').exists()).toBe(false)

    const shown = mount(MProgressSpinner, {
      props: { show: true, description: 'Saving' },
      slots: { default: '<p>Form</p>' },
    })
    expect(shown.get('.m-progress-spinner-wrap__overlay').text()).toContain('Saving')
  })

  it('marks wrapped content inert while loading overlay is visible', () => {
    const wrapper = mount(MProgressSpinner, {
      props: { show: true },
      slots: { default: '<button type="button">Save</button>' },
    })
    expect(wrapper.get('.m-progress-spinner-wrap__content').attributes('inert')).toBeDefined()
    expect(wrapper.get('.m-progress-spinner-wrap').attributes('aria-busy')).toBe('true')
  })
})
