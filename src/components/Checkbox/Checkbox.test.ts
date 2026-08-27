import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WiCheckbox from './Checkbox.vue'
import WiCheckboxGroup from './CheckboxGroup.vue'

describe('wiCheckbox', () => {
  it('associates its label and emits model updates', async () => {
    const wrapper = mount(WiCheckbox, { props: { id: 'terms', label: 'Accept terms' } })

    expect(wrapper.get('label').attributes('for')).toBe('terms')
    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('does not emit updates while disabled', async () => {
    const wrapper = mount(WiCheckbox, { props: { disabled: true } })

    await wrapper.get('input').trigger('change')

    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('marks invalid state for binary checkboxes', () => {
    const wrapper = mount(WiCheckbox, { props: { invalid: true, modelValue: false } })

    expect(wrapper.classes()).toContain('wi-checkbox--invalid')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect((wrapper.get('input').element as HTMLInputElement).checked).toBe(false)
  })

  it('sets mixed state when indeterminate', () => {
    const wrapper = mount(WiCheckbox, { props: { indeterminate: true, label: 'All' } })
    expect((wrapper.get('input').element as HTMLInputElement).indeterminate).toBe(true)
    expect(wrapper.get('input').attributes('aria-checked')).toBe('mixed')
  })

  it('toggles values inside a group', async () => {
    const wrapper = mount(WiCheckboxGroup, {
      props: { modelValue: ['a'] },
      slots: {
        default: () => [
          h(WiCheckbox, { value: 'a', label: 'A' }),
          h(WiCheckbox, { value: 'b', label: 'B' }),
        ],
      },
    })
    const inputs = wrapper.findAll('input')
    expect((inputs[0]!.element as HTMLInputElement).checked).toBe(true)
    await inputs[1]!.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'b']])
  })
})
