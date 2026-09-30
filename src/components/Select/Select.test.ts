import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import MSelect from './Select.vue'

const options = [
  { label: 'Small', value: 'sm' },
  { label: 'Large', value: 2 },
  { label: 'Disabled', value: 'disabled', disabled: true },
]

describe('muSelect', () => {
  it('associates its label and emits a typed selected value', async () => {
    const wrapper = mount(MSelect, { props: { id: 'size', label: 'Size', options } })

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
    const wrapper = mount(MSelect, {
      props: { options, placeholder: 'Choose a size', invalid: true, teleport: false },
    })
    const trigger = wrapper.get('[role="combobox"]')

    expect(trigger.text()).toContain('Choose a size')
    expect(trigger.attributes('aria-invalid')).toBe('true')
    expect(trigger.classes()).toContain('m-select--invalid')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.get('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.get('[role="listbox"]').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
  })

  it('supports size and fluid props', () => {
    const wrapper = mount(MSelect, { props: { options, size: 'small', fluid: true } })
    expect(wrapper.classes()).toContain('m-select-field--fluid')
    expect(wrapper.get('[role="combobox"]').classes()).toContain('m-select--small')
  })

  it('constrains the menu height and fills the list area with MScrollbar', async () => {
    const manyOptions = Array.from({ length: 30 }, (_, index) => ({
      label: `Option ${index + 1}`,
      value: index + 1,
    }))
    const wrapper = mount(MSelect, {
      props: { options: manyOptions, teleport: false },
      attachTo: document.body,
    })
    await wrapper.get('[role="combobox"]').trigger('click')
    await nextTick()

    expect(wrapper.get('.m-select__menu').classes()).toContain('m-select__menu')
    expect(wrapper.get('.m-select__list').classes()).toContain('m-scrollbar--fill')
    expect(wrapper.get('.m-select__list').classes()).toContain('m-scrollbar--fit-content')
    wrapper.unmount()
  })

  it('uses MScrollbar for option list scrolling', async () => {
    const wrapper = mount(MSelect, { props: { options, teleport: false } })
    await wrapper.get('[role="combobox"]').trigger('click')
    expect(wrapper.find('.m-select__list.m-scrollbar').exists()).toBe(true)
  })

  it('teleports the styled menu to body by default', async () => {
    const wrapper = mount(MSelect, { props: { options, modelValue: 'sm' }, attachTo: document.body })
    await wrapper.get('[role="combobox"]').trigger('click')
    await nextTick()

    expect(document.body.querySelector('.m-select__menu--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('clears the value when allowClear is enabled', async () => {
    const wrapper = mount(MSelect, {
      props: { options, modelValue: 'sm', allowClear: true, teleport: false },
    })
    await wrapper.get('.m-select__control').trigger('mouseenter')
    await wrapper.get('.m-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[undefined]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('emits labelInValue entries when labelInValue is on', async () => {
    const wrapper = mount(MSelect, {
      props: {
        options,
        labelInValue: true,
        modelValue: { value: 'sm', label: 'Small' },
        teleport: false,
      },
    })
    await wrapper.get('[role="combobox"]').trigger('click')
    await nextTick()
    await wrapper.findAll('[role="option"]')[1]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([
      [{ value: 2, label: 'Large' }],
    ])
  })

  it('filters options by label and shows the empty message', async () => {
    const wrapper = mount(MSelect, {
      props: {
        options,
        showSearch: true,
        notFoundContent: '暂无选项',
        teleport: false,
      },
    })
    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('.m-select__filter').setValue('zzz')
    await nextTick()
    expect(wrapper.findAll('[role="option"]')).toHaveLength(0)
    expect(wrapper.get('.m-select__empty').text()).toBe('暂无选项')

    await wrapper.get('.m-select__filter').setValue('lar')
    await nextTick()
    expect(wrapper.findAll('[role="option"]')).toHaveLength(1)
    expect(wrapper.get('[role="option"]').text()).toContain('Large')
  })

  it('shows empty message when options are empty', async () => {
    const wrapper = mount(MSelect, {
      props: { options: [], notFoundContent: '没有可选内容', teleport: false },
    })
    await wrapper.get('[role="combobox"]').trigger('click')
    expect(wrapper.get('.m-select__empty').text()).toBe('没有可选内容')
  })

  it('selects multiple values and keeps the menu open', async () => {
    const wrapper = mount(MSelect, {
      props: { options, mode: 'multiple', modelValue: [], teleport: false },
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
    const wrapper = mount(MSelect, {
      props: {
        options,
        mode: 'multiple',
        modelValue: ['sm', 2],
        maxTagCount: 1,
        teleport: false,
      },
    })
    expect(wrapper.get('.m-select__tag-label').text()).toBe('Small')
    // Default collapsed-tag summary comes from the `moreTags` locale copy.
    expect(wrapper.get('.m-select__tag--more').text()).toContain('1')
    await wrapper.get('.m-select__tag-remove').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[[2]]])
  })

  it('renders a custom maxTagPlaceholder', () => {
    const wrapper = mount(MSelect, {
      props: {
        options,
        mode: 'multiple',
        modelValue: ['sm', 2],
        maxTagCount: 1,
        maxTagPlaceholder: (omitted: unknown[]) => `+${omitted.length}`,
        teleport: false,
      },
    })

    expect(wrapper.get('.m-select__tag--more').text()).toBe('+1')
  })

  it('clears all selected values in multiple mode', async () => {
    const wrapper = mount(MSelect, {
      props: {
        options,
        mode: 'multiple',
        modelValue: ['sm', 2],
        allowClear: true,
        teleport: false,
      },
    })
    await wrapper.get('.m-select__control').trigger('mouseenter')
    await wrapper.get('.m-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[[]]])
  })

  it('skips local filtering when remote and emits search', async () => {
    const wrapper = mount(MSelect, {
      props: { options, showSearch: true, remote: true, teleport: false },
    })
    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('.m-select__filter').setValue('zzz')
    await nextTick()
    expect(wrapper.findAll('[role="option"]')).toHaveLength(options.length)
    expect(wrapper.emitted('search')?.at(-1)).toEqual(['zzz'])
  })

  it('shows loading copy and creates a tag option from the filter query', async () => {
    const loading = mount(MSelect, {
      props: { options: [], loading: true, teleport: false },
    })
    await loading.get('[role="combobox"]').trigger('click')
    expect(loading.get('.m-select__empty').text()).toBe('加载中')
    expect(loading.get('[role="combobox"]').attributes('aria-busy')).toBe('true')

    const wrapper = mount(MSelect, {
      props: { options, showSearch: true, mode: 'tags', teleport: false },
    })
    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('.m-select__filter').setValue('Brand new')
    await nextTick()
    const create = wrapper.get('.m-select__option--create')
    expect(create.text()).toContain('Brand new')
    await create.trigger('click')
    expect(wrapper.emitted('create')?.[0]?.[0]).toEqual({ label: 'Brand new', value: 'Brand new' })
    // `mode="tags"` is multi-value, so the payload is an array.
    expect(wrapper.emitted('update:modelValue')).toEqual([[['Brand new']]])
  })

  it('renders value and option slots', async () => {
    const wrapper = mount(MSelect, {
      props: { options, modelValue: 'sm', teleport: false },
      slots: {
        value: `<template #default="{ option }"><span class="custom-value">{{ option.label }}!</span></template>`,
        option: `<template #default="{ option }"><span class="custom-option">{{ option.label }}?</span></template>`,
      },
    })

    expect(wrapper.find('.custom-value').text()).toBe('Small!')
    await wrapper.get('[role="combobox"]').trigger('click')
    expect(wrapper.find('.custom-option').text()).toBe('Small?')
  })

  it('renders option groups and selects a grouped value', async () => {
    const wrapper = mount(MSelect, {
      props: {
        teleport: false,
        options: [
          {
            label: 'Fruit',
            options: [
              { label: 'Apple', value: 'apple' },
              { label: 'Banana', value: 'banana' },
            ],
          },
          { label: 'Loose', value: 'loose' },
        ],
      },
    })
    await wrapper.get('[role="combobox"]').trigger('click')

    const groupLabels = wrapper.findAll('.m-select__group-label')
    expect(groupLabels).toHaveLength(1)
    expect(groupLabels[0]!.text()).toBe('Fruit')
    expect(wrapper.findAll('[role="option"]')).toHaveLength(3)

    await wrapper.findAll('[role="option"]')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['banana']])
    await wrapper.setProps({ modelValue: 'banana' })
    expect(wrapper.get('[role="combobox"]').text()).toContain('Banana')
  })

  it('filters grouped options and drops empty groups', async () => {
    const wrapper = mount(MSelect, {
      props: {
        showSearch: true,
        teleport: false,
        options: [
          { label: 'Fruit', options: [{ label: 'Apple', value: 'apple' }] },
          { label: 'Vegetable', options: [{ label: 'Carrot', value: 'carrot' }] },
        ],
      },
    })
    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('.m-select__filter').setValue('carr')
    await nextTick()

    expect(wrapper.findAll('[role="option"]')).toHaveLength(1)
    const groupLabels = wrapper.findAll('.m-select__group-label')
    expect(groupLabels).toHaveLength(1)
    expect(groupLabels[0]!.text()).toBe('Vegetable')
  })

  it('keeps keyboard highlight on options when groups are present', async () => {
    const wrapper = mount(MSelect, {
      props: {
        teleport: false,
        options: [
          { label: 'Group', options: [{ label: 'One', value: 'one' }] },
          { label: 'Two', value: 'two' },
        ],
      },
    })
    await wrapper.get('[role="combobox"]').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.get('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.get('[role="listbox"]').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toEqual([['two']])
  })

  it('renders header and footer slots around the list', async () => {
    const wrapper = mount(MSelect, {
      props: { options, teleport: false },
      slots: {
        header: '<div class="custom-header">Select a size</div>',
        footer: '<div class="custom-footer">3 options</div>',
      },
    })
    await wrapper.get('[role="combobox"]').trigger('click')

    const menu = wrapper.get('.m-select__menu')
    expect(menu.find('.custom-header').text()).toBe('Select a size')
    expect(menu.find('.custom-footer').text()).toBe('3 options')
    expect(menu.element.firstElementChild?.classList.contains('m-select__header')).toBe(true)
    expect(menu.element.lastElementChild?.classList.contains('m-select__footer')).toBe(true)
  })

  it('maps status to invalid and warning chrome', () => {
    const warning = mount(MSelect, { props: { options, status: 'warning', teleport: false } })
    expect(warning.get('[role="combobox"]').classes()).toContain('m-select--warning')
    expect(warning.get('[role="combobox"]').attributes('aria-invalid')).toBeUndefined()

    const error = mount(MSelect, { props: { options, status: 'error', teleport: false } })
    expect(error.get('[role="combobox"]').classes()).toContain('m-select--invalid')
    expect(error.get('[role="combobox"]').attributes('aria-invalid')).toBe('true')
  })
})

describe('muSelect — field remapping and options', () => {
  it('reads renamed keys through fieldNames', async () => {
    const wrapper = mount(MSelect, {
      props: {
        teleport: false,
        fieldNames: { label: 'title', value: 'id' },
        options: [{ title: 'Apple', id: 'apple' }],
      },
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    await nextTick()

    expect(wrapper.get('[role="option"]').text()).toContain('Apple')
    await wrapper.get('[role="option"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['apple']])
  })

  it('filters on a custom optionFilterProp', async () => {
    const wrapper = mount(MSelect, {
      props: {
        teleport: false,
        showSearch: true,
        optionFilterProp: 'code',
        options: [
          { label: 'Small', value: 'sm', code: 'AA1' },
          { label: 'Large', value: 2, code: 'BB2' },
        ],
      },
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('.m-select__filter').setValue('bb')
    await nextTick()

    const rendered = wrapper.findAll('[role="option"]')
    expect(rendered).toHaveLength(1)
    expect(rendered[0]!.text()).toContain('Large')
  })

  it('honours a custom filterOption predicate', async () => {
    const wrapper = mount(MSelect, {
      props: {
        teleport: false,
        showSearch: true,
        filterOption: (_input: string, option: { value: string | number }) => option.value === 2,
        options,
      },
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('.m-select__filter').setValue('anything')
    await nextTick()

    const rendered = wrapper.findAll('[role="option"]')
    expect(rendered).toHaveLength(1)
    expect(rendered[0]!.text()).toContain('Large')
  })

  it('renders optionRender output', async () => {
    const wrapper = mount(MSelect, {
      props: {
        teleport: false,
        options,
        optionRender: (option: { label: string }) => `#${option.label}`,
      },
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    await nextTick()

    expect(wrapper.get('[role="option"]').text()).toContain('#Small')
  })

  it('wraps the menu through popupRender', async () => {
    const wrapper = mount(MSelect, {
      props: {
        teleport: false,
        options,
        popupRender: (menu: unknown) => h('div', { class: 'custom-popup' }, menu as never),
      },
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.custom-popup').exists()).toBe(true)
  })

  it('keeps a single popup root so overlay Transition classes can apply', async () => {
    const wrapper = mount(MSelect, {
      props: { options, teleport: false },
    })

    const transition = wrapper.findAllComponents({ name: 'Transition' })[0]
    expect(transition?.props('name')).toBe('m-scale-fade')
    expect(transition?.props('css')).toBe(true)

    await wrapper.get('[role="combobox"]').trigger('click')
    await nextTick()

    const menu = wrapper.get('.m-select__menu')
    // PopupWrapper must unwrap the slot array to a real element root; otherwise
    // Transition receives a Fragment and never applies m-scale-fade-* classes.
    expect(menu.element.nodeType).toBe(Node.ELEMENT_NODE)
    expect(menu.element.className).toContain('m-select__menu')
  })

  it('swaps the trigger icon through suffixIcon', () => {
    const fallback = mount(MSelect, { props: { options, teleport: false } })
    const custom = mount(MSelect, {
      props: { options, teleport: false, suffixIcon: 'search' },
    })

    expect(custom.get('.m-select__suffix').html()).not.toBe(
      fallback.get('.m-select__suffix').html(),
    )
  })

  it('applies filled variant class', () => {
    const wrapper = mount(MSelect, {
      props: { options, variant: 'filled', teleport: false },
    })

    expect(wrapper.get('[role="combobox"]').classes()).toContain('m-select--filled')
  })
})
