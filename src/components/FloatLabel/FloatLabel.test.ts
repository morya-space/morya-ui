import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WkFloatLabel from './FloatLabel.vue'

describe('wkFloatLabel', () => {
  it('renders default slot and label prop', () => {
    const wrapper = mount(WkFloatLabel, {
      props: { label: 'Email' },
      slots: { default: '<input placeholder=" " />' },
    })
    expect(wrapper.classes()).toContain('wk-float-label')
    expect(wrapper.get('label').text()).toBe('Email')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('supports label slot', () => {
    const wrapper = mount(WkFloatLabel, {
      slots: {
        default: '<input placeholder=" " />',
        label: 'Name',
      },
    })
    expect(wrapper.get('label').text()).toBe('Name')
  })

  it('associates label with the slotted control', async () => {
    const wrapper = mount(WkFloatLabel, {
      props: { label: 'Email' },
      slots: { default: '<input placeholder=" " />' },
      attachTo: document.body,
    })
    await nextTick()
    const input = wrapper.get('input')
    const label = wrapper.get('label')
    expect(input.attributes('id')).toBeTruthy()
    expect(label.attributes('for')).toBe(input.attributes('id'))
    wrapper.unmount()
  })
})
