import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdIconField from './IconField.vue'

describe('wdIconField', () => {
  it('defaults to left icon position', () => {
    const wrapper = mount(WdIconField, {
      slots: {
        default: '<input />',
        icon: '🔍',
      },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['wd-icon-field', 'wd-icon-field--left']))
    expect(wrapper.get('.wd-icon-field__icon').text()).toBe('🔍')
  })

  it('supports right icon position', () => {
    const wrapper = mount(WdIconField, {
      props: { iconPosition: 'right' },
      slots: { default: '<input />', icon: '×' },
    })
    expect(wrapper.classes()).toContain('wd-icon-field--right')
  })
})
