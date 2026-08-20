import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiSwitch from './Switch.vue'

describe('WiSwitch', () => {
  it('uses a native switch input and emits model updates', async () => {
    const wrapper = mount(WiSwitch, { props: { id: 'notifications', label: 'Notifications' } })

    expect(wrapper.get('label').attributes('for')).toBe('notifications')
    expect(wrapper.get('input').attributes('role')).toBe('switch')
    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('reflects the controlled model value and disabled state', () => {
    const wrapper = mount(WiSwitch, { props: { modelValue: true, disabled: true } })

    expect((wrapper.get('input').element as HTMLInputElement).checked).toBe(true)
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
  })

  it('supports invalid and inputId alias', () => {
    const wrapper = mount(WiSwitch, { props: { inputId: 'alerts', invalid: true, label: 'Alerts' } })

    expect(wrapper.get('label').attributes('for')).toBe('alerts')
    expect(wrapper.get('input').attributes('id')).toBe('alerts')
    expect(wrapper.classes()).toContain('wi-switch--invalid')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
  })
})
