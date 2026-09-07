import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import RdRadio from './Radio.vue'
import RdRadioGroup from './RadioGroup.vue'

describe('RadioGroup', () => {
  it('exposes radiogroup role and propagates disabled state', () => {
    const wrapper = mount(RdRadioGroup, {
      props: { disabled: true, invalid: true },
      slots: { default: () => h(RdRadio, { value: 'a', label: 'A' }) },
    })
    expect(wrapper.attributes('role')).toBe('radiogroup')
    expect(wrapper.classes()).toContain('rd-radio-group--disabled')
    expect(wrapper.classes()).toContain('rd-radio-group--invalid')
  })

  it('updates model when a child radio is selected', async () => {
    const wrapper = mount(RdRadioGroup, {
      props: { modelValue: 'a' },
      slots: {
        default: () => [
          h(RdRadio, { value: 'a', label: 'A' }),
          h(RdRadio, { value: 'b', label: 'B' }),
        ],
      },
    })
    await wrapper.findAll('input')[1]!.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b'])
  })
})
