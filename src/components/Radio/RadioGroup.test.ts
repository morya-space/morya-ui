import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WiRadio from './Radio.vue'
import WiRadioGroup from './RadioGroup.vue'

describe('RadioGroup', () => {
  it('exposes radiogroup role and propagates disabled state', () => {
    const wrapper = mount(WiRadioGroup, {
      props: { disabled: true, invalid: true },
      slots: { default: () => h(WiRadio, { value: 'a', label: 'A' }) },
    })
    expect(wrapper.attributes('role')).toBe('radiogroup')
    expect(wrapper.classes()).toContain('wi-radio-group--disabled')
    expect(wrapper.classes()).toContain('wi-radio-group--invalid')
  })

  it('updates model when a child radio is selected', async () => {
    const wrapper = mount(WiRadioGroup, {
      props: { modelValue: 'a' },
      slots: {
        default: () => [
          h(WiRadio, { value: 'a', label: 'A' }),
          h(WiRadio, { value: 'b', label: 'B' }),
        ],
      },
    })
    await wrapper.findAll('input')[1]!.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b'])
  })
})
