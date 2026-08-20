import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiRadio from './Radio.vue'

describe('WiRadio', () => {
  it('associates its label and emits its value when selected', async () => {
    const wrapper = mount(WiRadio, { props: { id: 'small', label: 'Small', value: 'sm' } })

    expect(wrapper.get('label').attributes('for')).toBe('small')
    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toEqual([['sm']])
  })

  it('reflects the controlled model value and disabled state', () => {
    const wrapper = mount(WiRadio, { props: { modelValue: 'sm', value: 'sm', disabled: true } })

    expect((wrapper.get('input').element as HTMLInputElement).checked).toBe(true)
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
  })

  it('marks invalid state', () => {
    const wrapper = mount(WiRadio, { props: { value: 'a', invalid: true } })

    expect(wrapper.classes()).toContain('wi-radio--invalid')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
  })
})
