import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdCheckbox from './Checkbox.vue'

describe('WdCheckbox', () => {
  it('associates its label and emits model updates', async () => {
    const wrapper = mount(WdCheckbox, { props: { id: 'terms', label: 'Accept terms' } })

    expect(wrapper.get('label').attributes('for')).toBe('terms')
    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('does not emit updates while disabled', async () => {
    const wrapper = mount(WdCheckbox, { props: { disabled: true } })

    await wrapper.get('input').trigger('change')

    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('marks invalid state for binary checkboxes', () => {
    const wrapper = mount(WdCheckbox, { props: { invalid: true, modelValue: false } })

    expect(wrapper.classes()).toContain('wd-checkbox--invalid')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect((wrapper.get('input').element as HTMLInputElement).checked).toBe(false)
  })
})
