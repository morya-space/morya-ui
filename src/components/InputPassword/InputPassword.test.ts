import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import RdInputPassword from './InputPassword.vue'

describe('rdInputPassword', () => {
  it('emits model updates and toggles mask', async () => {
    const wrapper = mount(RdInputPassword, { props: { label: 'Password', id: 'pwd' } })
    expect(wrapper.get('label').attributes('for')).toBe('pwd')
    expect(wrapper.get('input').attributes('type')).toBe('password')
    await wrapper.get('input').setValue('secret')
    expect(wrapper.emitted('update:modelValue')).toEqual([['secret']])
    await wrapper.get('.rd-password__toggle').trigger('click')
    expect(wrapper.get('input').attributes('type')).toBe('text')
  })

  it('renders an icon toggle instead of text by default', () => {
    const wrapper = mount(RdInputPassword)
    const toggle = wrapper.get('.rd-password__toggle')
    expect(toggle.text()).toBe('')
    expect(toggle.find('.rd-icon').exists()).toBe(true)
    expect(toggle.attributes('aria-label')).toBe('显示密码')
  })

  it('swaps to the hide icon after revealing the value', async () => {
    const wrapper = mount(RdInputPassword)
    await wrapper.get('.rd-password__toggle').trigger('click')
    expect(wrapper.get('.rd-password__toggle').attributes('aria-label')).toBe('隐藏密码')
    expect(wrapper.get('.rd-password__toggle').attributes('aria-pressed')).toBe('true')
  })

  it('replaces icons via showIcon / hideIcon props', async () => {
    const wrapper = mount(RdInputPassword, { props: { showIcon: 'lock', hideIcon: 'unlock' } })
    expect(wrapper.get('.rd-password__toggle .rd-icon').exists()).toBe(true)
    await wrapper.get('.rd-password__toggle').trigger('click')
    expect(wrapper.get('.rd-password__toggle .rd-icon').exists()).toBe(true)
  })

  it('replaces icons via showIcon / hideIcon slots', async () => {
    const wrapper = mount(RdInputPassword, {
      slots: {
        showIcon: () => h('span', { class: 'custom-show' }, 'show'),
        hideIcon: () => h('span', { class: 'custom-hide' }, 'hide'),
      },
    })
    expect(wrapper.find('.custom-show').exists()).toBe(true)
    expect(wrapper.find('.rd-icon').exists()).toBe(false)
    await wrapper.get('.rd-password__toggle').trigger('click')
    expect(wrapper.find('.custom-hide').exists()).toBe(true)
    expect(wrapper.find('.custom-show').exists()).toBe(false)
  })

  it('shows strength feedback when enabled', async () => {
    const wrapper = mount(RdInputPassword, {
      props: { modelValue: 'Ab1!', feedback: true },
    })
    expect(wrapper.get('.rd-password__feedback').text()).toContain('强度')
  })

  it('hides toggle when toggleMask is false', () => {
    const wrapper = mount(RdInputPassword, { props: { toggleMask: false } })
    expect(wrapper.find('.rd-password__toggle').exists()).toBe(false)
    expect(wrapper.find('.rd-password--toggle').exists()).toBe(false)
  })

  it('clears the value and can peek on mousedown', async () => {
    const wrapper = mount(RdInputPassword, {
      props: { modelValue: 'secret', clearable: true, showPasswordOn: 'mousedown', showCount: true, maxlength: 20 },
    })
    expect(wrapper.get('.rd-password-field__count').text()).toBe('6 / 20')
    await wrapper.get('.rd-password__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
    expect(wrapper.emitted('clear')).toHaveLength(1)

    const peek = mount(RdInputPassword, {
      props: { modelValue: 'secret', showPasswordOn: 'mousedown' },
    })
    expect(peek.get('input').attributes('type')).toBe('password')
    await peek.get('.rd-password__toggle').trigger('mousedown')
    expect(peek.get('input').attributes('type')).toBe('text')
    document.dispatchEvent(new MouseEvent('mouseup'))
    await peek.vm.$nextTick()
    expect(peek.get('input').attributes('type')).toBe('password')
  })
})
