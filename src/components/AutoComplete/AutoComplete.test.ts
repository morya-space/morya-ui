import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WiAutoComplete from './AutoComplete.vue'

describe('wiAutoComplete', () => {
  it('emits complete and update on input', async () => {
    const wrapper = mount(WiAutoComplete, {
      props: { modelValue: '', suggestions: ['Apple', 'Apricot', 'Banana'] },
      attachTo: document.body,
    })
    await wrapper.find('.wi-autocomplete__input').setValue('Ap')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Ap'])
    expect(wrapper.emitted('complete')?.at(-1)).toEqual(['Ap'])
    await nextTick()
    const items = document.body.querySelectorAll('.wi-autocomplete__item')
    expect(items.length).toBeGreaterThan(0)
    items[0]!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toMatch(/^Ap/)
    wrapper.unmount()
  })

  it('shows dropdown suggestions when toggled', async () => {
    const wrapper = mount(WiAutoComplete, {
      props: { dropdown: true, suggestions: ['One', 'Two'], modelValue: '', teleport: false },
    })
    await wrapper.find('.wi-autocomplete__dropdown').trigger('click')
    expect(wrapper.findAll('.wi-autocomplete__item')).toHaveLength(2)
  })

  it('teleports the panel to body by default', async () => {
    const wrapper = mount(WiAutoComplete, {
      props: { suggestions: ['One', 'Two'], modelValue: '' },
      attachTo: document.body,
    })
    await wrapper.find('.wi-autocomplete__input').trigger('focus')
    await nextTick()
    expect(document.body.querySelector('.wi-autocomplete__panel--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('selects option objects and can clear', async () => {
    const wrapper = mount(WiAutoComplete, {
      props: {
        suggestions: [{ label: 'Apple', value: 'apple' }],
        modelValue: 'ap',
        clearable: true,
        teleport: false,
      },
    })
    await wrapper.find('.wi-autocomplete__input').trigger('focus')
    await nextTick()
    await wrapper.get('.wi-autocomplete__item').trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['apple'])
    await wrapper.setProps({ modelValue: 'apple' })
    await wrapper.get('.wi-autocomplete__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('renders item and empty slots', async () => {
    const wrapper = mount(WiAutoComplete, {
      props: { suggestions: [{ label: 'Apple', value: 'apple' }], modelValue: '', teleport: false },
      slots: {
        item: `<template #default="{ option }"><span class="custom-item">{{ option.label }}!</span></template>`,
        empty: `<template #default><span class="custom-empty">Nothing here</span></template>`,
      },
    })
    await wrapper.find('.wi-autocomplete__input').trigger('focus')
    await nextTick()
    expect(wrapper.find('.custom-item').text()).toBe('Apple!')

    await wrapper.setProps({ modelValue: 'nomatch' })
    await nextTick()
    expect(wrapper.find('.custom-empty').text()).toBe('Nothing here')
  })
})
