import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WiTreeSelect from './TreeSelect.vue'

const options = [
  {
    key: 'docs',
    label: 'Documents',
    children: [
      { key: 'resume', label: 'Resume' },
      { key: 'home', label: 'Home' },
    ],
  },
]

describe('wiTreeSelect', () => {
  it('selects a tree node from the dropdown', async () => {
    const wrapper = mount(WiTreeSelect, {
      props: { options, modelValue: null, teleport: false },
    })
    await wrapper.find('.wi-treeselect__trigger').trigger('click')
    await wrapper.find('.wi-treeselect__toggler').trigger('click')
    await wrapper.findAll('.wi-treeselect__option').find((n) => n.text() === 'Resume')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['resume'])
  })

  it('shows selected label', () => {
    const wrapper = mount(WiTreeSelect, { props: { options, modelValue: 'home' } })
    expect(wrapper.find('.wi-treeselect__label').text()).toBe('Home')
  })

  it('teleports the panel to body by default', async () => {
    const wrapper = mount(WiTreeSelect, {
      props: { options, modelValue: null },
      attachTo: document.body,
    })
    await wrapper.find('.wi-treeselect__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.wi-treeselect__panel--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('selects multiple keys and filters nodes', async () => {
    const wrapper = mount(WiTreeSelect, {
      props: { options, modelValue: [], multiple: true, filterable: true, teleport: false },
    })
    await wrapper.find('.wi-treeselect__trigger').trigger('click')
    await wrapper.find('.wi-treeselect__filter').setValue('Resume')
    await wrapper.find('.wi-treeselect__toggler').trigger('click')
    await wrapper.findAll('.wi-treeselect__option').find((n) => n.text() === 'Resume')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['resume']])
  })

  it('clears value when clearable and hovered', async () => {
    const wrapper = mount(WiTreeSelect, {
      props: { options, modelValue: 'home', clearable: true, teleport: false },
    })
    await wrapper.find('.wi-select__control').trigger('mouseenter')
    await wrapper.find('.wi-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('supports treeview keyboard navigation and selection', async () => {
    const wrapper = mount(WiTreeSelect, {
      props: { options, modelValue: null, teleport: false },
      attachTo: document.body,
    })
    const triggerEl = wrapper.get('.wi-treeselect__trigger')
    await triggerEl.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const panel = wrapper.get('.wi-treeselect__panel')
    expect(triggerEl.attributes('aria-controls')).toBe(panel.attributes('id'))

    const docsOption = () =>
      wrapper.findAll('.wi-treeselect__option').find((n) => n.text() === 'Documents')!
    expect(document.activeElement).toBe(docsOption().element)

    await panel.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.find('.wi-treeselect__node').attributes('aria-expanded')).toBe('true')

    await panel.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    const resume = wrapper.findAll('.wi-treeselect__option').find((n) => n.text() === 'Resume')!
    expect(document.activeElement).toBe(resume.element)
    expect(resume.attributes('tabindex')).toBe('0')
    expect(docsOption().attributes('tabindex')).toBe('-1')

    await panel.trigger('keydown', { key: 'ArrowLeft' })
    await nextTick()
    expect(document.activeElement).toBe(docsOption().element)

    await panel.trigger('keydown', { key: 'ArrowRight' })
    await panel.trigger('keydown', { key: 'ArrowRight' })
    await panel.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['resume'])
    await nextTick()
    expect(wrapper.find('.wi-treeselect__panel').exists()).toBe(false)
    expect(document.activeElement).toBe(triggerEl.element)
    wrapper.unmount()
  })

  it('closes on Escape from the panel and restores trigger focus', async () => {
    const wrapper = mount(WiTreeSelect, {
      props: { options, modelValue: null, teleport: false },
      attachTo: document.body,
    })
    const triggerEl = wrapper.get('.wi-treeselect__trigger')
    await triggerEl.trigger('click')
    await nextTick()
    await wrapper.get('.wi-treeselect__panel').trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find('.wi-treeselect__panel').exists()).toBe(false)
    expect(document.activeElement).toBe(triggerEl.element)
    wrapper.unmount()
  })

  it('exposes treeitem aria state', async () => {
    const wrapper = mount(WiTreeSelect, {
      props: { options, modelValue: 'home', teleport: false },
    })
    await wrapper.find('.wi-treeselect__trigger').trigger('click')
    await wrapper.find('.wi-treeselect__toggler').trigger('click')
    const items = wrapper.findAll('.wi-treeselect__node')
    expect(items[0]!.attributes('aria-level')).toBe('1')
    const home = items.find(
      (n) =>
        (n.element as HTMLElement).querySelector(':scope > .wi-treeselect__row .wi-treeselect__option')
          ?.textContent === 'Home',
    )!
    expect(home.attributes('aria-selected')).toBe('true')
    expect(home.attributes('aria-level')).toBe('2')
  })
})
