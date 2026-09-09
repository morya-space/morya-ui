import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import MInputPassword from './InputPassword.vue'

describe('muInputPassword', () => {
  it('emits model updates and toggles mask', async () => {
    const wrapper = mount(MInputPassword, { props: { label: 'Password', id: 'pwd' } })
    expect(wrapper.get('label').attributes('for')).toBe('pwd')
    expect(wrapper.get('input').attributes('type')).toBe('password')
    await wrapper.get('input').setValue('secret')
    expect(wrapper.emitted('update:modelValue')).toEqual([['secret']])
    await wrapper.get('.m-password__toggle').trigger('click')
    expect(wrapper.get('input').attributes('type')).toBe('text')
  })

  it('renders an icon toggle instead of text by default', () => {
    const wrapper = mount(MInputPassword)
    const toggle = wrapper.get('.m-password__toggle')
    expect(toggle.text()).toBe('')
    expect(toggle.find('.m-icon').exists()).toBe(true)
    expect(toggle.attributes('aria-label')).toBe('显示密码')
  })

  it('swaps to the hide icon after revealing the value', async () => {
    const wrapper = mount(MInputPassword)
    await wrapper.get('.m-password__toggle').trigger('click')
    expect(wrapper.get('.m-password__toggle').attributes('aria-label')).toBe('隐藏密码')
    expect(wrapper.get('.m-password__toggle').attributes('aria-pressed')).toBe('true')
  })

  it('replaces icons via showIcon / hideIcon props', async () => {
    const wrapper = mount(MInputPassword, { props: { showIcon: 'lock', hideIcon: 'unlock' } })
    expect(wrapper.get('.m-password__toggle .m-icon').exists()).toBe(true)
    await wrapper.get('.m-password__toggle').trigger('click')
    expect(wrapper.get('.m-password__toggle .m-icon').exists()).toBe(true)
  })

  it('replaces icons via showIcon / hideIcon slots', async () => {
    const wrapper = mount(MInputPassword, {
      slots: {
        showIcon: () => h('span', { class: 'custom-show' }, 'show'),
        hideIcon: () => h('span', { class: 'custom-hide' }, 'hide'),
      },
    })
    expect(wrapper.find('.custom-show').exists()).toBe(true)
    expect(wrapper.find('.m-icon').exists()).toBe(false)
    await wrapper.get('.m-password__toggle').trigger('click')
    expect(wrapper.find('.custom-hide').exists()).toBe(true)
    expect(wrapper.find('.custom-show').exists()).toBe(false)
  })

  it('shows strength feedback when enabled', async () => {
    const wrapper = mount(MInputPassword, {
      props: { modelValue: 'Ab1!', feedback: true },
    })
    expect(wrapper.get('.m-password__feedback').text()).toContain('强度')
  })

  it('hides toggle when toggleMask is false', () => {
    const wrapper = mount(MInputPassword, { props: { toggleMask: false } })
    expect(wrapper.find('.m-password__toggle').exists()).toBe(false)
    expect(wrapper.find('.m-password--toggle').exists()).toBe(false)
  })

  it('clears the value and can peek on mousedown', async () => {
    const wrapper = mount(MInputPassword, {
      props: { modelValue: 'secret', clearable: true, showPasswordOn: 'mousedown', showCount: true, maxlength: 20 },
    })
    expect(wrapper.get('.m-password-field__count').text()).toBe('6 / 20')
    await wrapper.get('.m-password__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
    expect(wrapper.emitted('clear')).toHaveLength(1)

    const peek = mount(MInputPassword, {
      props: { modelValue: 'secret', showPasswordOn: 'mousedown' },
    })
    expect(peek.get('input').attributes('type')).toBe('password')
    await peek.get('.m-password__toggle').trigger('mousedown')
    expect(peek.get('input').attributes('type')).toBe('text')
    document.dispatchEvent(new MouseEvent('mouseup'))
    await peek.vm.$nextTick()
    expect(peek.get('input').attributes('type')).toBe('password')
  })
})
