import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdFloatLabel from './FloatLabel.vue'

describe('WdFloatLabel', () => {
  it('renders default slot and label prop', () => {
    const wrapper = mount(WdFloatLabel, {
      props: { label: 'Email' },
      slots: { default: '<input placeholder=" " />' },
    })
    expect(wrapper.classes()).toContain('wd-float-label')
    expect(wrapper.get('label').text()).toBe('Email')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('supports label slot', () => {
    const wrapper = mount(WdFloatLabel, {
      slots: {
        default: '<input placeholder=" " />',
        label: 'Name',
      },
    })
    expect(wrapper.get('label').text()).toBe('Name')
  })
})
