import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WkCascadeSelect from './CascadeSelect.vue'

const options = [
  {
    label: 'Electronics',
    value: 'electronics',
    children: [
      { label: 'Phone', value: 'phone' },
      { label: 'Laptop', value: 'laptop' },
    ],
  },
  { label: 'Books', value: 'books' },
]

describe('wkCascadeSelect', () => {
  it('opens nested columns and selects a leaf', async () => {
    const wrapper = mount(WkCascadeSelect, {
      props: { options, modelValue: null, teleport: false },
    })
    await wrapper.find('.wk-cascadeselect__trigger').trigger('click')
    expect(wrapper.findAll('.wk-cascadeselect__column')).toHaveLength(1)
    await wrapper.findAll('.wk-cascadeselect__option')[0]!.trigger('click')
    expect(wrapper.findAll('.wk-cascadeselect__column')).toHaveLength(2)
    const phone = wrapper.findAll('.wk-cascadeselect__option').find((node) => node.text().includes('Phone'))
    await phone!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['phone'])
  })

  it('shows selected label', () => {
    const wrapper = mount(WkCascadeSelect, { props: { options, modelValue: 'laptop' } })
    expect(wrapper.find('.wk-cascadeselect__label').text()).toBe('Laptop')
  })

  it('clears value when clearable is enabled', async () => {
    const wrapper = mount(WkCascadeSelect, {
      props: { options, modelValue: 'laptop', clearable: true, teleport: false },
    })
    await wrapper.get('.wk-select__control').trigger('mouseenter')
    await wrapper.get('.wk-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('opens with ArrowDown and supports full keyboard selection', async () => {
    const wrapper = mount(WkCascadeSelect, {
      props: { options, modelValue: null, teleport: false },
      attachTo: document.body,
    })
    const triggerEl = wrapper.get('.wk-cascadeselect__trigger')
    await triggerEl.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const panel = wrapper.get('.wk-cascadeselect__panel')
    expect(triggerEl.attributes('aria-controls')).toBe(panel.attributes('id'))
    expect(document.activeElement).toBe(wrapper.findAll('.wk-cascadeselect__option')[0]!.element)

    await panel.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.findAll('.wk-cascadeselect__column')).toHaveLength(2)
    const columns = wrapper.findAll('.wk-cascadeselect__column')
    expect(document.activeElement).toBe(
      (columns[1]!.element as HTMLElement).querySelector('.wk-cascadeselect__option'),
    )

    await panel.trigger('keydown', { key: 'ArrowDown' })
    await panel.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['laptop'])
    await nextTick()
    expect(wrapper.find('.wk-cascadeselect__panel').exists()).toBe(false)
    expect(document.activeElement).toBe(triggerEl.element)
    wrapper.unmount()
  })

  it('restores the selected path when reopening', async () => {
    const wrapper = mount(WkCascadeSelect, {
      props: { options, modelValue: 'laptop', teleport: false },
      attachTo: document.body,
    })
    await wrapper.get('.wk-cascadeselect__trigger').trigger('click')
    await nextTick()
    expect(wrapper.findAll('.wk-cascadeselect__column')).toHaveLength(2)
    const laptop = wrapper
      .findAll('.wk-cascadeselect__option')
      .find((node) => node.text().includes('Laptop'))
    expect(document.activeElement).toBe(laptop!.element)
    expect(laptop!.classes()).toContain('wk-cascadeselect__option--selected')
    wrapper.unmount()
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const wrapper = mount(WkCascadeSelect, {
      props: { options, modelValue: null, teleport: false },
      attachTo: document.body,
    })
    const triggerEl = wrapper.get('.wk-cascadeselect__trigger')
    await triggerEl.trigger('click')
    await nextTick()
    await wrapper.get('.wk-cascadeselect__panel').trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find('.wk-cascadeselect__panel').exists()).toBe(false)
    expect(document.activeElement).toBe(triggerEl.element)
    wrapper.unmount()
  })

  it('renders invalid state with combobox semantics aligned to Select', () => {
    const wrapper = mount(WkCascadeSelect, {
      props: { options, invalid: true, errorMessage: 'Required', teleport: false },
    })
    const trigger = wrapper.get('.wk-cascadeselect__trigger')
    expect(trigger.attributes('role')).toBe('combobox')
    expect(trigger.attributes('aria-invalid')).toBe('true')
    expect(trigger.classes()).toContain('wk-cascadeselect__trigger--invalid')
    expect(wrapper.get('.wk-select-field__help').text()).toBe('Required')
  })

  it('teleports the panel to body by default', async () => {
    const wrapper = mount(WkCascadeSelect, {
      props: { options, modelValue: null },
      attachTo: document.body,
    })
    await wrapper.find('.wk-cascadeselect__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.wk-cascadeselect__panel--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('keeps the overlay as wide as the trigger', async () => {
    const wrapper = mount(WkCascadeSelect, {
      props: { options, modelValue: null, teleport: false },
      attachTo: document.body,
    })
    const trigger = wrapper.get('.wk-cascadeselect__trigger').element as HTMLElement
    Object.defineProperty(trigger, 'getBoundingClientRect', {
      value: () => ({
        width: 240,
        height: 34,
        top: 10,
        left: 16,
        bottom: 44,
        right: 256,
        x: 16,
        y: 10,
        toJSON() {
          return {}
        },
      }),
    })
    await wrapper.find('.wk-cascadeselect__trigger').trigger('click')
    await nextTick()
    const panel = wrapper.get('.wk-cascadeselect__panel')
    expect(panel.attributes('style')).toContain('width: 240px')
    await wrapper.findAll('.wk-cascadeselect__option')[0]!.trigger('click')
    await nextTick()
    expect(wrapper.findAll('.wk-cascadeselect__column')).toHaveLength(2)
    expect(wrapper.get('.wk-cascadeselect__panel').attributes('style')).toContain('width: 240px')
    wrapper.unmount()
  })
})
