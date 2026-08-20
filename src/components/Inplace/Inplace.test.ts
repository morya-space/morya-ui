import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiInplace from './Inplace.vue'

describe('WiInplace', () => {
  it('switches from display to content on activate', async () => {
    const wrapper = mount(WiInplace, {
      props: { modelValue: false },
      slots: {
        display: '<span>Edit me</span>',
        content: '<input class="editor" />',
      },
    })
    expect(wrapper.text()).toContain('Edit me')
    await wrapper.find('.wi-inplace__display').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('shows content when active', () => {
    const wrapper = mount(WiInplace, {
      props: { modelValue: true },
      slots: {
        display: 'Display',
        content: '<span class="active-content">Editing</span>',
      },
    })
    expect(wrapper.find('.active-content').exists()).toBe(true)
    expect(wrapper.find('.wi-inplace__display').exists()).toBe(false)
  })
})
