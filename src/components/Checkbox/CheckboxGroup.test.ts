import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import RdCheckbox from './Checkbox.vue'
import RdCheckboxGroup from './CheckboxGroup.vue'

describe('checkboxGroup', () => {
  it('exposes group role and disabled modifier', () => {
    const wrapper = mount(RdCheckboxGroup, {
      props: { disabled: true, modelValue: [] },
      slots: { default: () => h(RdCheckbox, { value: 'a', label: 'A' }) },
    })
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.classes()).toContain('rd-checkbox-group--disabled')
  })

  it('supports group aria-label', () => {
    const wrapper = mount(RdCheckboxGroup, {
      props: { label: 'Permissions', modelValue: [] },
      slots: { default: () => h(RdCheckbox, { value: 'a', label: 'A' }) },
    })
    expect(wrapper.attributes('aria-label')).toBe('Permissions')
  })

  it('toggles values through group context', async () => {
    const wrapper = mount(RdCheckboxGroup, {
      props: { modelValue: ['a'] },
      slots: {
        default: () => [
          h(RdCheckbox, { value: 'a', label: 'A' }),
          h(RdCheckbox, { value: 'b', label: 'B' }),
        ],
      },
    })
    await wrapper.findAll('input')[1]!.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'b']])
  })
})
