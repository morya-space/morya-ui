import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import RdRadio from './Radio.vue'
import RdRadioGroup from './RadioGroup.vue'

describe('rdRadio', () => {
  it('associates its label and emits its value when selected', async () => {
    const wrapper = mount(RdRadio, { props: { id: 'small', label: 'Small', value: 'sm' } })

    expect(wrapper.get('label').attributes('for')).toBe('small')
    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toEqual([['sm']])
  })

  it('reflects the controlled model value and disabled state', () => {
    const wrapper = mount(RdRadio, { props: { modelValue: 'sm', value: 'sm', disabled: true } })

    expect((wrapper.get('input').element as HTMLInputElement).checked).toBe(true)
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
  })

  it('marks invalid state', () => {
    const wrapper = mount(RdRadio, { props: { value: 'a', invalid: true } })

    expect(wrapper.classes()).toContain('rd-radio--invalid')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
  })

  it('selects a value inside a group', async () => {
    const wrapper = mount(RdRadioGroup, {
      props: { modelValue: 'a' },
      slots: {
        default: () => [
          h(RdRadio, { value: 'a', label: 'A' }),
          h(RdRadio, { value: 'b', label: 'B' }),
        ],
      },
    })
    const inputs = wrapper.findAll('input')
    expect((inputs[0]!.element as HTMLInputElement).checked).toBe(true)
    await inputs[1]!.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b'])
  })
})
