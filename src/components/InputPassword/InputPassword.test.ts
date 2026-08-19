import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WdInputPassword from './InputPassword.vue'

describe('WdInputPassword', () => {
  it('emits model updates and toggles mask', async () => {
    const wrapper = mount(WdInputPassword, { props: { label: 'Password', id: 'pwd' } })
    expect(wrapper.get('label').attributes('for')).toBe('pwd')
    expect(wrapper.get('input').attributes('type')).toBe('password')
    await wrapper.get('input').setValue('secret')
    expect(wrapper.emitted('update:modelValue')).toEqual([['secret']])
    await wrapper.get('.wd-password__toggle').trigger('click')
    expect(wrapper.get('input').attributes('type')).toBe('text')
  })

  it('renders an icon toggle instead of text by default', () => {
    const wrapper = mount(WdInputPassword)
    const toggle = wrapper.get('.wd-password__toggle')
    expect(toggle.text()).toBe('')
    expect(toggle.find('.wd-icon').exists()).toBe(true)
    expect(toggle.attributes('aria-label')).toBe('显示密码')
  })

  it('swaps to the hide icon after revealing the value', async () => {
    const wrapper = mount(WdInputPassword)
    await wrapper.get('.wd-password__toggle').trigger('click')
    expect(wrapper.get('.wd-password__toggle').attributes('aria-label')).toBe('隐藏密码')
    expect(wrapper.get('.wd-password__toggle').attributes('aria-pressed')).toBe('true')
  })

  it('replaces icons via showIcon / hideIcon props', async () => {
    const wrapper = mount(WdInputPassword, { props: { showIcon: 'lock', hideIcon: 'unlock' } })
    expect(wrapper.get('.wd-password__toggle .wd-icon').exists()).toBe(true)
    await wrapper.get('.wd-password__toggle').trigger('click')
    expect(wrapper.get('.wd-password__toggle .wd-icon').exists()).toBe(true)
  })

  it('replaces icons via showIcon / hideIcon slots', async () => {
    const wrapper = mount(WdInputPassword, {
      slots: {
        showIcon: () => h('span', { class: 'custom-show' }, 'show'),
        hideIcon: () => h('span', { class: 'custom-hide' }, 'hide'),
      },
    })
    expect(wrapper.find('.custom-show').exists()).toBe(true)
    expect(wrapper.find('.wd-icon').exists()).toBe(false)
    await wrapper.get('.wd-password__toggle').trigger('click')
    expect(wrapper.find('.custom-hide').exists()).toBe(true)
    expect(wrapper.find('.custom-show').exists()).toBe(false)
  })

  it('shows strength feedback when enabled', async () => {
    const wrapper = mount(WdInputPassword, {
      props: { modelValue: 'Ab1!', feedback: true },
    })
    expect(wrapper.get('.wd-password__feedback').text()).toContain('强度')
  })

  it('hides toggle when toggleMask is false', () => {
    const wrapper = mount(WdInputPassword, { props: { toggleMask: false } })
    expect(wrapper.find('.wd-password__toggle').exists()).toBe(false)
    expect(wrapper.find('.wd-password--toggle').exists()).toBe(false)
  })
})
