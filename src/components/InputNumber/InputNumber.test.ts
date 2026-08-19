import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdInputNumber from './InputNumber.vue'

describe('WdInputNumber', () => {
  it('associates label and emits numeric updates', async () => {
    const wrapper = mount(WdInputNumber, { props: { label: 'Qty', id: 'qty' } })
    expect(wrapper.get('label').attributes('for')).toBe('qty')
    await wrapper.get('input').setValue('12')
    expect(wrapper.emitted('update:modelValue')).toEqual([[12]])
  })

  it('clamps with buttons and respects min/max', async () => {
    const wrapper = mount(WdInputNumber, {
      props: { modelValue: 5, min: 0, max: 10, step: 2, showButtons: true },
    })
    await wrapper.get('.wd-inputnumber__button--increment').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([7])
    await wrapper.setProps({ modelValue: 9 })
    await wrapper.get('.wd-inputnumber__button--increment').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([10])
  })

  it('maps size, fluid, and invalid classes', () => {
    const wrapper = mount(WdInputNumber, {
      props: { size: 'small', fluid: true, invalid: true },
    })
    expect(wrapper.get('.wd-inputnumber').classes()).toEqual(
      expect.arrayContaining(['wd-inputnumber--small', 'wd-inputnumber--fluid', 'wd-inputnumber--invalid']),
    )
  })
})
