import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WiInputPassword from './InputPassword.vue'

describe('WiInputPassword', () => {
  it('emits model updates and toggles mask', async () => {
    const wrapper = mount(WiInputPassword, { props: { label: 'Password', id: 'pwd' } })
    expect(wrapper.get('label').attributes('for')).toBe('pwd')
    expect(wrapper.get('input').attributes('type')).toBe('password')
    await wrapper.get('input').setValue('secret')
    expect(wrapper.emitted('update:modelValue')).toEqual([['secret']])
    await wrapper.get('.wi-password__toggle').trigger('click')
    expect(wrapper.get('input').attributes('type')).toBe('text')
  })

  it('renders an icon toggle instead of text by default', () => {
    const wrapper = mount(WiInputPassword)
    const toggle = wrapper.get('.wi-password__toggle')
    expect(toggle.text()).toBe('')
    expect(toggle.find('.wi-icon').exists()).toBe(true)
    expect(toggle.attributes('aria-label')).toBe('显示密码')
  })

  it('swaps to the hide icon after revealing the value', async () => {
    const wrapper = mount(WiInputPassword)
    await wrapper.get('.wi-password__toggle').trigger('click')
    expect(wrapper.get('.wi-password__toggle').attributes('aria-label')).toBe('隐藏密码')
    expect(wrapper.get('.wi-password__toggle').attributes('aria-pressed')).toBe('true')
  })

  it('replaces icons via showIcon / hideIcon props', async () => {
    const wrapper = mount(WiInputPassword, { props: { showIcon: 'lock', hideIcon: 'unlock' } })
    expect(wrapper.get('.wi-password__toggle .wi-icon').exists()).toBe(true)
    await wrapper.get('.wi-password__toggle').trigger('click')
    expect(wrapper.get('.wi-password__toggle .wi-icon').exists()).toBe(true)
  })

  it('replaces icons via showIcon / hideIcon slots', async () => {
    const wrapper = mount(WiInputPassword, {
      slots: {
        showIcon: () => h('span', { class: 'custom-show' }, 'show'),
        hideIcon: () => h('span', { class: 'custom-hide' }, 'hide'),
      },
    })
    expect(wrapper.find('.custom-show').exists()).toBe(true)
    expect(wrapper.find('.wi-icon').exists()).toBe(false)
    await wrapper.get('.wi-password__toggle').trigger('click')
    expect(wrapper.find('.custom-hide').exists()).toBe(true)
    expect(wrapper.find('.custom-show').exists()).toBe(false)
  })

  it('shows strength feedback when enabled', async () => {
    const wrapper = mount(WiInputPassword, {
      props: { modelValue: 'Ab1!', feedback: true },
    })
    expect(wrapper.get('.wi-password__feedback').text()).toContain('强度')
  })

  it('hides toggle when toggleMask is false', () => {
    const wrapper = mount(WiInputPassword, { props: { toggleMask: false } })
    expect(wrapper.find('.wi-password__toggle').exists()).toBe(false)
    expect(wrapper.find('.wi-password--toggle').exists()).toBe(false)
  })
})
