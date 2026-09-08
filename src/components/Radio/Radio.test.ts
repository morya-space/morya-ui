import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WkRadio from './Radio.vue'
import WkRadioGroup from './RadioGroup.vue'

describe('wkRadio', () => {
  it('associates its label and emits its value when selected', async () => {
    const wrapper = mount(WkRadio, { props: { id: 'small', label: 'Small', value: 'sm' } })

    expect(wrapper.get('label').attributes('for')).toBe('small')
    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toEqual([['sm']])
  })

  it('reflects the controlled model value and disabled state', () => {
    const wrapper = mount(WkRadio, { props: { modelValue: 'sm', value: 'sm', disabled: true } })

    expect((wrapper.get('input').element as HTMLInputElement).checked).toBe(true)
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
  })

  it('marks invalid state', () => {
    const wrapper = mount(WkRadio, { props: { value: 'a', invalid: true } })

    expect(wrapper.classes()).toContain('wk-radio--invalid')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
  })

  it('selects a value inside a group', async () => {
    const wrapper = mount(WkRadioGroup, {
      props: { modelValue: 'a' },
      slots: {
        default: () => [
          h(WkRadio, { value: 'a', label: 'A' }),
          h(WkRadio, { value: 'b', label: 'B' }),
        ],
      },
    })
    const inputs = wrapper.findAll('input')
    expect((inputs[0]!.element as HTMLInputElement).checked).toBe(true)
    await inputs[1]!.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b'])
  })
})
