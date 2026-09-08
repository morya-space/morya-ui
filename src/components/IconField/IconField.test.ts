import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkIconField from './IconField.vue'

describe('wkIconField', () => {
  it('defaults to left icon position', () => {
    const wrapper = mount(WkIconField, {
      slots: {
        default: '<input />',
        icon: '🔍',
      },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['wk-icon-field', 'wk-icon-field--left']))
    expect(wrapper.get('.wk-icon-field__icon').text()).toBe('🔍')
  })

  it('supports right icon position', () => {
    const wrapper = mount(WkIconField, {
      props: { iconPosition: 'right' },
      slots: { default: '<input />', icon: '×' },
    })
    expect(wrapper.classes()).toContain('wk-icon-field--right')
  })
})
