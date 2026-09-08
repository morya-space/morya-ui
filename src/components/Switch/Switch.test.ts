import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkSwitch from './Switch.vue'

describe('wkSwitch', () => {
  it('uses a native switch input and emits model updates', async () => {
    const wrapper = mount(WkSwitch, { props: { id: 'notifications', label: 'Notifications' } })

    expect(wrapper.get('label').attributes('for')).toBe('notifications')
    expect(wrapper.get('input').attributes('role')).toBe('switch')
    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('reflects the controlled model value and disabled state', () => {
    const wrapper = mount(WkSwitch, { props: { modelValue: true, disabled: true } })

    expect((wrapper.get('input').element as HTMLInputElement).checked).toBe(true)
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
  })

  it('supports invalid and inputId alias', () => {
    const wrapper = mount(WkSwitch, { props: { inputId: 'alerts', invalid: true, label: 'Alerts' } })

    expect(wrapper.get('label').attributes('for')).toBe('alerts')
    expect(wrapper.get('input').attributes('id')).toBe('alerts')
    expect(wrapper.classes()).toContain('wk-switch--invalid')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
  })

  it('shows loading and checked text', () => {
    const wrapper = mount(WkSwitch, {
      props: { modelValue: true, loading: true, checkedText: 'On', uncheckedText: 'Off' },
    })
    expect(wrapper.classes()).toContain('wk-switch--loading')
    expect(wrapper.get('.wk-switch__text').text()).toBe('On')
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
  })
})
