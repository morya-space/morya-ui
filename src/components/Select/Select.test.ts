import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WiSelect from './Select.vue'

const options = [
  { label: 'Small', value: 'sm' },
  { label: 'Large', value: 2 },
  { label: 'Disabled', value: 'disabled', disabled: true },
]

describe('wiSelect', () => {
  it('associates its label and emits a typed selected value', async () => {
    const wrapper = mount(WiSelect, { props: { id: 'size', label: 'Size', options } })

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
    const wrapper = mount(WiSelect, {
      props: { options, placeholder: 'Choose a size', invalid: true, teleport: false },
    })
    const trigger = wrapper.get('[role="combobox"]')

    expect(trigger.text()).toContain('Choose a size')
    expect(trigger.attributes('aria-invalid')).toBe('true')
    expect(trigger.classes()).toContain('wi-select--invalid')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.get('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.get('[role="listbox"]').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
  })

  it('supports size and fluid props', () => {
    const wrapper = mount(WiSelect, { props: { options, size: 'small', fluid: true } })
    expect(wrapper.classes()).toContain('wi-select-field--fluid')
    expect(wrapper.get('[role="combobox"]').classes()).toContain('wi-select--small')
  })

  it('teleports the styled menu to body by default', async () => {
    const wrapper = mount(WiSelect, { props: { options, modelValue: 'sm' }, attachTo: document.body })
    await wrapper.get('[role="combobox"]').trigger('click')
    await nextTick()

    expect(document.body.querySelector('.wi-select__menu--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('clears the value when showClear is enabled', async () => {
    const wrapper = mount(WiSelect, {
      props: { options, modelValue: 'sm', showClear: true, teleport: false },
    })
    await wrapper.get('.wi-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[undefined]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('filters options by label and shows empty message', async () => {
    const wrapper = mount(WiSelect, {
      props: {
        options,
        filter: true,
        emptyMessage: '暂无选项',
        teleport: false,
      },
    })
    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('.wi-select__filter').setValue('zzz')
    await nextTick()
    expect(wrapper.findAll('[role="option"]')).toHaveLength(0)
    expect(wrapper.get('.wi-select__empty').text()).toBe('暂无选项')

    await wrapper.get('.wi-select__filter').setValue('lar')
    await nextTick()
    expect(wrapper.findAll('[role="option"]')).toHaveLength(1)
    expect(wrapper.get('[role="option"]').text()).toContain('Large')
  })

  it('shows empty message when options are empty', async () => {
    const wrapper = mount(WiSelect, {
      props: { options: [], emptyMessage: '没有可选内容', teleport: false },
    })
    await wrapper.get('[role="combobox"]').trigger('click')
    expect(wrapper.get('.wi-select__empty').text()).toBe('没有可选内容')
  })

  it('selects multiple values and keeps the menu open', async () => {
    const wrapper = mount(WiSelect, {
      props: { options, multiple: true, modelValue: [], teleport: false },
    })
    await wrapper.get('[role="combobox"]').trigger('click')
    const items = wrapper.findAll('[role="option"]')
    await items[0]!.trigger('click')
    await wrapper.setProps({ modelValue: ['sm'] })
    await items[1]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[['sm']], [['sm', 2]]])
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
  })

  it('renders removable tags and can collapse extras', async () => {
    const wrapper = mount(WiSelect, {
      props: {
        options,
        multiple: true,
        modelValue: ['sm', 2],
        maxTagCount: 1,
        teleport: false,
      },
    })
    expect(wrapper.get('.wi-select__tag-label').text()).toBe('Small')
    expect(wrapper.get('.wi-select__tag--more').text()).toBe('+1')
    await wrapper.get('.wi-select__tag-remove').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[[2]]])
  })

  it('clears all selected values in multiple mode', async () => {
    const wrapper = mount(WiSelect, {
      props: { options, multiple: true, modelValue: ['sm', 2], showClear: true, teleport: false },
    })
    await wrapper.get('.wi-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[[]]])
  })

  it('skips local filtering when remote and emits search', async () => {
    const wrapper = mount(WiSelect, {
      props: { options, filter: true, remote: true, teleport: false },
    })
    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('.wi-select__filter').setValue('zzz')
    await nextTick()
    expect(wrapper.findAll('[role="option"]')).toHaveLength(options.length)
    expect(wrapper.emitted('search')?.at(-1)).toEqual(['zzz'])
  })

  it('shows loading copy and creates a tag option from the filter query', async () => {
    const loading = mount(WiSelect, {
      props: { options: [], loading: true, teleport: false },
    })
    await loading.get('[role="combobox"]').trigger('click')
    expect(loading.get('.wi-select__empty').text()).toBe('加载中')
    expect(loading.get('[role="combobox"]').attributes('aria-busy')).toBe('true')

    const wrapper = mount(WiSelect, {
      props: { options, filter: true, tag: true, teleport: false },
    })
    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('.wi-select__filter').setValue('Brand new')
    await nextTick()
    const create = wrapper.get('.wi-select__option--create')
    expect(create.text()).toContain('Brand new')
    await create.trigger('click')
    expect(wrapper.emitted('create')?.[0]?.[0]).toEqual({ label: 'Brand new', value: 'Brand new' })
    expect(wrapper.emitted('update:modelValue')).toEqual([['Brand new']])
  })
})
