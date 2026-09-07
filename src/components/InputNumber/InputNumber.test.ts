import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdInputNumber from './InputNumber.vue'

describe('rdInputNumber', () => {
  it('associates label and emits numeric updates', async () => {
    const wrapper = mount(RdInputNumber, { props: { label: 'Qty', id: 'qty' } })
    expect(wrapper.get('label').attributes('for')).toBe('qty')
    await wrapper.get('input').setValue('12')
    expect(wrapper.emitted('update:modelValue')).toEqual([[12]])
  })

  it('clamps with buttons and respects min/max', async () => {
    const wrapper = mount(RdInputNumber, {
      props: { modelValue: 5, min: 0, max: 10, step: 2, showButtons: true },
    })
    await wrapper.get('.rd-inputnumber__button--increment').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([7])
    await wrapper.setProps({ modelValue: 9 })
    await wrapper.get('.rd-inputnumber__button--increment').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([10])
  })

  it('maps size, fluid, and invalid classes', () => {
    const wrapper = mount(RdInputNumber, {
      props: { size: 'small', fluid: true, invalid: true },
    })
    expect(wrapper.get('.rd-inputnumber').classes()).toEqual(
      expect.arrayContaining(['rd-inputnumber--small', 'rd-inputnumber--fluid', 'rd-inputnumber--invalid']),
    )
  })

  it('rounds to precision and can clear', async () => {
    const wrapper = mount(RdInputNumber, { props: { modelValue: 1.234, precision: 1, step: 0.1, clearable: true } })
    await wrapper.get('.rd-inputnumber__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
    const stepped = mount(RdInputNumber, { props: { modelValue: 1.24, precision: 1, step: 0.1, showButtons: true } })
    await stepped.get('.rd-inputnumber__button--increment').trigger('click')
    expect(stepped.emitted('update:modelValue')?.at(-1)).toEqual([1.3])
  })

  it('keeps draft while typing negative numbers and decimals', async () => {
    const wrapper = mount(RdInputNumber, { props: { modelValue: 3 } })
    const input = wrapper.get('input')
    const el = input.element as HTMLInputElement

    el.value = '-'
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect((input.element as HTMLInputElement).value).toBe('-')

    el.value = '-5'
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([-5])

    el.value = '1.'
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([-5])

    el.value = '1.5'
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1.5])
  })

  it('clamps draft on blur without disturbing typing', async () => {
    const wrapper = mount(RdInputNumber, { props: { min: 0, max: 10 } })
    const input = wrapper.get('input')
    await input.setValue('-4')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([-4])
    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0])
    expect((input.element as HTMLInputElement).value).toBe('0')
  })

  it('commits draft on Enter', async () => {
    const wrapper = mount(RdInputNumber, { props: { precision: 1 } })
    const input = wrapper.get('input')
    await input.setValue('1.26')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1.3])
  })
})
