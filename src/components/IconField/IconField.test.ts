import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MIconField from './IconField.vue'

describe('muIconField', () => {
  it('defaults to left icon position', () => {
    const wrapper = mount(MIconField, {
      slots: {
        default: '<input />',
        icon: '🔍',
      },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['m-icon-field', 'm-icon-field--left']))
    expect(wrapper.get('.m-icon-field__icon').text()).toBe('🔍')
  })

  it('supports right icon position', () => {
    const wrapper = mount(MIconField, {
      props: { iconPosition: 'right' },
      slots: { default: '<input />', icon: '×' },
    })
    expect(wrapper.classes()).toContain('m-icon-field--right')
  })
})
