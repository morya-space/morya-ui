import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiFloatLabel from './FloatLabel.vue'

describe('WiFloatLabel', () => {
  it('renders default slot and label prop', () => {
    const wrapper = mount(WiFloatLabel, {
      props: { label: 'Email' },
      slots: { default: '<input placeholder=" " />' },
    })
    expect(wrapper.classes()).toContain('wi-float-label')
    expect(wrapper.get('label').text()).toBe('Email')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('supports label slot', () => {
    const wrapper = mount(WiFloatLabel, {
      slots: {
        default: '<input placeholder=" " />',
        label: 'Name',
      },
    })
    expect(wrapper.get('label').text()).toBe('Name')
  })
})
