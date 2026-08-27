import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiInputNumber from './InputNumber.vue'

describe('wiInputNumber', () => {
  it('associates label and emits numeric updates', async () => {
    const wrapper = mount(WiInputNumber, { props: { label: 'Qty', id: 'qty' } })
    expect(wrapper.get('label').attributes('for')).toBe('qty')
    await wrapper.get('input').setValue('12')
    expect(wrapper.emitted('update:modelValue')).toEqual([[12]])
  })

  it('clamps with buttons and respects min/max', async () => {
    const wrapper = mount(WiInputNumber, {
      props: { modelValue: 5, min: 0, max: 10, step: 2, showButtons: true },
    })
    await wrapper.get('.wi-inputnumber__button--increment').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([7])
    await wrapper.setProps({ modelValue: 9 })
    await wrapper.get('.wi-inputnumber__button--increment').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([10])
  })

  it('maps size, fluid, and invalid classes', () => {
    const wrapper = mount(WiInputNumber, {
      props: { size: 'small', fluid: true, invalid: true },
    })
    expect(wrapper.get('.wi-inputnumber').classes()).toEqual(
      expect.arrayContaining(['wi-inputnumber--small', 'wi-inputnumber--fluid', 'wi-inputnumber--invalid']),
    )
  })

  it('rounds to precision and can clear', async () => {
    const wrapper = mount(WiInputNumber, { props: { modelValue: 1.234, precision: 1, step: 0.1, clearable: true } })
    await wrapper.get('.wi-inputnumber__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
    const stepped = mount(WiInputNumber, { props: { modelValue: 1.24, precision: 1, step: 0.1, showButtons: true } })
    await stepped.get('.wi-inputnumber__button--increment').trigger('click')
    expect(stepped.emitted('update:modelValue')?.at(-1)).toEqual([1.3])
  })
})
