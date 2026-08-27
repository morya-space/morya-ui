import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiIconField from './IconField.vue'

describe('wiIconField', () => {
  it('defaults to left icon position', () => {
    const wrapper = mount(WiIconField, {
      slots: {
        default: '<input />',
        icon: '🔍',
      },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['wi-icon-field', 'wi-icon-field--left']))
    expect(wrapper.get('.wi-icon-field__icon').text()).toBe('🔍')
  })

  it('supports right icon position', () => {
    const wrapper = mount(WiIconField, {
      props: { iconPosition: 'right' },
      slots: { default: '<input />', icon: '×' },
    })
    expect(wrapper.classes()).toContain('wi-icon-field--right')
  })
})
