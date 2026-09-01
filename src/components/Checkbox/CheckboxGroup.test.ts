import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WiCheckbox from './Checkbox.vue'
import WiCheckboxGroup from './CheckboxGroup.vue'

describe('CheckboxGroup', () => {
  it('exposes group role and disabled modifier', () => {
    const wrapper = mount(WiCheckboxGroup, {
      props: { disabled: true, modelValue: [] },
      slots: { default: () => h(WiCheckbox, { value: 'a', label: 'A' }) },
    })
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.classes()).toContain('wi-checkbox-group--disabled')
  })

  it('toggles values through group context', async () => {
    const wrapper = mount(WiCheckboxGroup, {
      props: { modelValue: ['a'] },
      slots: {
        default: () => [
          h(WiCheckbox, { value: 'a', label: 'A' }),
          h(WiCheckbox, { value: 'b', label: 'B' }),
        ],
      },
    })
    await wrapper.findAll('input')[1]!.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'b']])
  })
})
