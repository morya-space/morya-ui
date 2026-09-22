import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import MCascadeSelect from './CascadeSelect.vue'

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

describe('muCascadeSelect', () => {
  it('opens nested columns and selects a leaf', async () => {
    const wrapper = mount(MCascadeSelect, {
      props: { options, modelValue: null, teleport: false },
    })
    await wrapper.find('.m-cascadeselect__trigger').trigger('click')
    expect(wrapper.findAll('.m-cascadeselect__column')).toHaveLength(1)
    await wrapper.findAll('.m-cascadeselect__option')[0]!.trigger('click')
    expect(wrapper.findAll('.m-cascadeselect__column')).toHaveLength(2)
    expect(wrapper.findAll('.m-cascadeselect__option')[0]!.classes()).toContain(
      'm-cascadeselect__option--in-path',
    )
    const leafOptions = wrapper
      .findAll('.m-cascadeselect__column')[1]!
      .findAll('.m-cascadeselect__option')
    expect(leafOptions.every((node) => !node.classes().includes('m-cascadeselect__option--highlighted'))).toBe(
      true,
    )
    const phone = wrapper.findAll('.m-cascadeselect__option').find((node) => node.text().includes('Phone'))
    await phone!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['phone'])
  })

  it('shows selected label', () => {
    const wrapper = mount(MCascadeSelect, { props: { options, modelValue: 'laptop' } })
    expect(wrapper.find('.m-cascadeselect__label').text()).toBe('Laptop')
  })

  it('clears value when clearable is enabled', async () => {
    const wrapper = mount(MCascadeSelect, {
      props: { options, modelValue: 'laptop', clearable: true, teleport: false },
    })
    await wrapper.get('.m-cascadeselect__control').trigger('mouseenter')
    await wrapper.get('.m-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('opens with ArrowDown and supports full keyboard selection', async () => {
    const wrapper = mount(MCascadeSelect, {
      props: { options, modelValue: null, teleport: false },
      attachTo: document.body,
    })
    const triggerEl = wrapper.get('.m-cascadeselect__trigger')
    await triggerEl.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const panel = wrapper.get('.m-cascadeselect__panel')
    expect(triggerEl.attributes('aria-controls')).toBe(panel.attributes('id'))
    expect(document.activeElement).toBe(wrapper.findAll('.m-cascadeselect__option')[0]!.element)

    await panel.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.findAll('.m-cascadeselect__column')).toHaveLength(2)
    const columns = wrapper.findAll('.m-cascadeselect__column')
    expect(document.activeElement).toBe(
      (columns[1]!.element as HTMLElement).querySelector('.m-cascadeselect__option'),
    )

    await panel.trigger('keydown', { key: 'ArrowDown' })
    await panel.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['laptop'])
    await nextTick()
    expect(wrapper.find('.m-cascadeselect__panel').exists()).toBe(false)
    expect(document.activeElement).toBe(triggerEl.element)
    wrapper.unmount()
  })

  it('restores the selected path when reopening', async () => {
    const wrapper = mount(MCascadeSelect, {
      props: { options, modelValue: 'laptop', teleport: false },
      attachTo: document.body,
    })
    await wrapper.get('.m-cascadeselect__trigger').trigger('click')
    await nextTick()
    expect(wrapper.findAll('.m-cascadeselect__column')).toHaveLength(2)
    const electronics = wrapper
      .findAll('.m-cascadeselect__option')
      .find((node) => node.text().includes('Electronics'))
    const laptop = wrapper
      .findAll('.m-cascadeselect__option')
      .find((node) => node.text().includes('Laptop'))
    expect(electronics!.classes()).toContain('m-cascadeselect__option--in-path')
    expect(laptop!.classes()).toContain('m-cascadeselect__option--selected')
    expect(laptop!.classes()).not.toContain('m-cascadeselect__option--highlighted')
    expect(laptop!.find('.m-cascadeselect__check').exists()).toBe(true)
    wrapper.unmount()
  })

  it('does not pre-highlight options when opened with the mouse', async () => {
    const wrapper = mount(MCascadeSelect, {
      props: { options, modelValue: 'laptop', teleport: false },
    })
    await wrapper.get('.m-cascadeselect__trigger').trigger('click')
    await nextTick()
    const laptop = wrapper
      .findAll('.m-cascadeselect__option')
      .find((node) => node.text().includes('Laptop'))
    expect(laptop!.classes()).toContain('m-cascadeselect__option--selected')
    expect(laptop!.classes()).not.toContain('m-cascadeselect__option--highlighted')
    expect(
      wrapper.findAll('.m-cascadeselect__option').filter((node) =>
        node.classes().includes('m-cascadeselect__option--highlighted'),
      ),
    ).toHaveLength(0)
    expect(laptop!.find('.m-cascadeselect__check').exists()).toBe(true)
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const wrapper = mount(MCascadeSelect, {
      props: { options, modelValue: null, teleport: false },
      attachTo: document.body,
    })
    const triggerEl = wrapper.get('.m-cascadeselect__trigger')
    await triggerEl.trigger('click')
    await nextTick()
    await wrapper.get('.m-cascadeselect__panel').trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find('.m-cascadeselect__panel').exists()).toBe(false)
    expect(document.activeElement).toBe(triggerEl.element)
    wrapper.unmount()
  })

  it('renders invalid state with combobox semantics aligned to Select', () => {
    const wrapper = mount(MCascadeSelect, {
      props: { options, invalid: true, errorMessage: 'Required', teleport: false },
    })
    const trigger = wrapper.get('.m-cascadeselect__trigger')
    expect(trigger.attributes('role')).toBe('combobox')
    expect(trigger.attributes('aria-invalid')).toBe('true')
    expect(trigger.classes()).toContain('m-cascadeselect__trigger--invalid')
    expect(wrapper.get('.m-select-field__help').text()).toBe('Required')
  })

  it('teleports the panel to body by default', async () => {
    const wrapper = mount(MCascadeSelect, {
      props: { options, modelValue: null },
      attachTo: document.body,
    })
    await wrapper.find('.m-cascadeselect__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.m-cascadeselect__panel--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('keeps overlay at least as wide as the trigger and grows with columns', async () => {
    const wrapper = mount(MCascadeSelect, {
      props: { options, modelValue: null, teleport: false },
      attachTo: document.body,
    })
    const trigger = wrapper.get('.m-cascadeselect__trigger').element as HTMLElement
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
    await wrapper.find('.m-cascadeselect__trigger').trigger('click')
    await nextTick()
    const panel = wrapper.get('.m-cascadeselect__panel')
    expect(panel.attributes('style')).toContain('min-width: 240px')
    expect(panel.attributes('style') ?? '').not.toMatch(/(?:^|;)\s*width:\s*240px/)
    await wrapper.findAll('.m-cascadeselect__option')[0]!.trigger('click')
    await nextTick()
    expect(wrapper.findAll('.m-cascadeselect__column')).toHaveLength(2)
    expect(wrapper.get('.m-cascadeselect__panel').attributes('style')).toContain('min-width: 240px')
    wrapper.unmount()
  })
})
