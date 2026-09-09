import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import MCheckbox from './Checkbox.vue'
import MCheckboxGroup from './CheckboxGroup.vue'

describe('checkboxGroup', () => {
  it('exposes group role and disabled modifier', () => {
    const wrapper = mount(MCheckboxGroup, {
      props: { disabled: true, modelValue: [] },
      slots: { default: () => h(MCheckbox, { value: 'a', label: 'A' }) },
    })
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.classes()).toContain('m-checkbox-group--disabled')
  })

  it('supports group aria-label', () => {
    const wrapper = mount(MCheckboxGroup, {
      props: { label: 'Permissions', modelValue: [] },
      slots: { default: () => h(MCheckbox, { value: 'a', label: 'A' }) },
    })
    expect(wrapper.attributes('aria-label')).toBe('Permissions')
  })

  it('toggles values through group context', async () => {
    const wrapper = mount(MCheckboxGroup, {
      props: { modelValue: ['a'] },
      slots: {
        default: () => [
          h(MCheckbox, { value: 'a', label: 'A' }),
          h(MCheckbox, { value: 'b', label: 'B' }),
        ],
      },
    })
    await wrapper.findAll('input')[1]!.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'b']])
  })
})
