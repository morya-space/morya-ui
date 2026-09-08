import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WkCheckbox from './Checkbox.vue'
import WkCheckboxGroup from './CheckboxGroup.vue'

describe('checkboxGroup', () => {
  it('exposes group role and disabled modifier', () => {
    const wrapper = mount(WkCheckboxGroup, {
      props: { disabled: true, modelValue: [] },
      slots: { default: () => h(WkCheckbox, { value: 'a', label: 'A' }) },
    })
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.classes()).toContain('wk-checkbox-group--disabled')
  })

  it('supports group aria-label', () => {
    const wrapper = mount(WkCheckboxGroup, {
      props: { label: 'Permissions', modelValue: [] },
      slots: { default: () => h(WkCheckbox, { value: 'a', label: 'A' }) },
    })
    expect(wrapper.attributes('aria-label')).toBe('Permissions')
  })

  it('toggles values through group context', async () => {
    const wrapper = mount(WkCheckboxGroup, {
      props: { modelValue: ['a'] },
      slots: {
        default: () => [
          h(WkCheckbox, { value: 'a', label: 'A' }),
          h(WkCheckbox, { value: 'b', label: 'B' }),
        ],
      },
    })
    await wrapper.findAll('input')[1]!.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'b']])
  })
})
