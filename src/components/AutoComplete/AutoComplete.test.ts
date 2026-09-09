import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import MAutoComplete from './AutoComplete.vue'

describe('muAutoComplete', () => {
  it('emits complete and update on input', async () => {
    const wrapper = mount(MAutoComplete, {
      props: { modelValue: '', suggestions: ['Apple', 'Apricot', 'Banana'] },
      attachTo: document.body,
    })
    await wrapper.find('.m-autocomplete__input').setValue('Ap')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Ap'])
    expect(wrapper.emitted('complete')?.at(-1)).toEqual(['Ap'])
    await nextTick()
    const items = document.body.querySelectorAll('.m-autocomplete__item')
    expect(items.length).toBeGreaterThan(0)
    items[0]!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toMatch(/^Ap/)
    wrapper.unmount()
  })

  it('shows dropdown suggestions when toggled', async () => {
    const wrapper = mount(MAutoComplete, {
      props: { dropdown: true, suggestions: ['One', 'Two'], modelValue: '', teleport: false },
    })
    await wrapper.find('.m-autocomplete__dropdown').trigger('click')
    expect(wrapper.findAll('.m-autocomplete__item')).toHaveLength(2)
  })

  it('teleports the panel to body by default', async () => {
    const wrapper = mount(MAutoComplete, {
      props: { suggestions: ['One', 'Two'], modelValue: '' },
      attachTo: document.body,
    })
    await wrapper.find('.m-autocomplete__input').trigger('focus')
    await nextTick()
    expect(document.body.querySelector('.m-autocomplete__panel--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('selects option objects and can clear', async () => {
    const wrapper = mount(MAutoComplete, {
      props: {
        suggestions: [{ label: 'Apple', value: 'apple' }],
        modelValue: 'ap',
        clearable: true,
        teleport: false,
      },
    })
    await wrapper.find('.m-autocomplete__input').trigger('focus')
    await nextTick()
    await wrapper.get('.m-autocomplete__item').trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['apple'])
    await wrapper.setProps({ modelValue: 'apple' })
    await wrapper.get('.m-autocomplete__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('renders item and empty slots', async () => {
    const wrapper = mount(MAutoComplete, {
      props: { suggestions: [{ label: 'Apple', value: 'apple' }], modelValue: '', teleport: false },
      slots: {
        item: `<template #default="{ option }"><span class="custom-item">{{ option.label }}!</span></template>`,
        empty: `<template #default><span class="custom-empty">Nothing here</span></template>`,
      },
    })
    await wrapper.find('.m-autocomplete__input').trigger('focus')
    await nextTick()
    expect(wrapper.find('.custom-item').text()).toBe('Apple!')

    await wrapper.setProps({ modelValue: 'nomatch' })
    await nextTick()
    expect(wrapper.find('.custom-empty').text()).toBe('Nothing here')
  })
})
