import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WdCheckbox from './Checkbox.vue'
import WdCheckboxGroup from './CheckboxGroup.vue'

describe('checkboxGroup', () => {
  it('exposes group role and disabled modifier', () => {
    const wrapper = mount(WdCheckboxGroup, {
      props: { disabled: true, modelValue: [] },
      slots: { default: () => h(WdCheckbox, { value: 'a', label: 'A' }) },
    })
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.classes()).toContain('wd-checkbox-group--disabled')
  })

  it('supports group aria-label', () => {
    const wrapper = mount(WdCheckboxGroup, {
      props: { label: 'Permissions', modelValue: [] },
      slots: { default: () => h(WdCheckbox, { value: 'a', label: 'A' }) },
    })
    expect(wrapper.attributes('aria-label')).toBe('Permissions')
  })

  it('toggles values through group context', async () => {
    const wrapper = mount(WdCheckboxGroup, {
      props: { modelValue: ['a'] },
      slots: {
        default: () => [
          h(WdCheckbox, { value: 'a', label: 'A' }),
          h(WdCheckbox, { value: 'b', label: 'B' }),
        ],
      },
    })
    await wrapper.findAll('input')[1]!.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'b']])
  })
})
