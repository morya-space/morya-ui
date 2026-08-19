import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WdSelect from './Select.vue'

const options = [
  { label: 'Small', value: 'sm' },
  { label: 'Large', value: 2 },
  { label: 'Disabled', value: 'disabled', disabled: true },
]

describe('WdSelect', () => {
  it('associates its label and emits a typed selected value', async () => {
    const wrapper = mount(WdSelect, { props: { id: 'size', label: 'Size', options } })

    expect(wrapper.get('label').attributes('for')).toBe('size')
    await wrapper.get('[role="combobox"]').trigger('click')
    await nextTick()
    const largeOption = document.body.querySelectorAll('[role="option"]')[1] as HTMLButtonElement
    expect(largeOption).toBeDefined()
    largeOption.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
    expect(wrapper.emitted('change')).toEqual([[2]])
    wrapper.unmount()
  })

  it('renders placeholder and invalid state, then supports keyboard selection', async () => {
    const wrapper = mount(WdSelect, {
      props: { options, placeholder: 'Choose a size', invalid: true, teleport: false },
    })
    const trigger = wrapper.get('[role="combobox"]')

    expect(trigger.text()).toContain('Choose a size')
    expect(trigger.attributes('aria-invalid')).toBe('true')
    expect(trigger.classes()).toContain('wd-select--error')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.get('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.get('[role="listbox"]').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
  })

  it('supports size and fluid props', () => {
    const wrapper = mount(WdSelect, { props: { options, size: 'small', fluid: true } })
    expect(wrapper.classes()).toContain('wd-select-field--fluid')
    expect(wrapper.get('[role="combobox"]').classes()).toContain('wd-select--small')
  })

  it('teleports the styled menu to body by default', async () => {
    const wrapper = mount(WdSelect, { props: { options, modelValue: 'sm' }, attachTo: document.body })
    await wrapper.get('[role="combobox"]').trigger('click')
    await nextTick()

    expect(document.body.querySelector('.wd-select__menu--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('clears the value when showClear is enabled', async () => {
    const wrapper = mount(WdSelect, {
      props: { options, modelValue: 'sm', showClear: true, teleport: false },
    })
    await wrapper.get('.wd-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[undefined]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('filters options by label and shows empty message', async () => {
    const wrapper = mount(WdSelect, {
      props: {
        options,
        filter: true,
        emptyMessage: '暂无选项',
        teleport: false,
      },
    })
    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('.wd-select__filter').setValue('zzz')
    await nextTick()
    expect(wrapper.findAll('[role="option"]')).toHaveLength(0)
    expect(wrapper.get('.wd-select__empty').text()).toBe('暂无选项')

    await wrapper.get('.wd-select__filter').setValue('lar')
    await nextTick()
    expect(wrapper.findAll('[role="option"]')).toHaveLength(1)
    expect(wrapper.get('[role="option"]').text()).toContain('Large')
  })

  it('shows empty message when options are empty', async () => {
    const wrapper = mount(WdSelect, {
      props: { options: [], emptyMessage: '没有可选内容', teleport: false },
    })
    await wrapper.get('[role="combobox"]').trigger('click')
    expect(wrapper.get('.wd-select__empty').text()).toBe('没有可选内容')
  })
})
