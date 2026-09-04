import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WdTreeSelect from './TreeSelect.vue'

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

describe('wdTreeSelect', () => {
  it('selects a tree node from the dropdown', async () => {
    const wrapper = mount(WdTreeSelect, {
      props: { options, modelValue: null, teleport: false },
    })
    await wrapper.find('.wd-treeselect__trigger').trigger('click')
    await wrapper.find('.wd-treeselect__toggler').trigger('click')
    await wrapper.findAll('.wd-treeselect__option').find((n) => n.text() === 'Resume')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['resume'])
  })

  it('shows selected label', () => {
    const wrapper = mount(WdTreeSelect, { props: { options, modelValue: 'home' } })
    expect(wrapper.find('.wd-treeselect__label').text()).toBe('Home')
  })

  it('teleports the panel to body by default', async () => {
    const wrapper = mount(WdTreeSelect, {
      props: { options, modelValue: null },
      attachTo: document.body,
    })
    await wrapper.find('.wd-treeselect__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.wd-treeselect__panel--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('selects multiple keys and filters nodes', async () => {
    const wrapper = mount(WdTreeSelect, {
      props: { options, modelValue: [], multiple: true, filterable: true, teleport: false },
    })
    await wrapper.find('.wd-treeselect__trigger').trigger('click')
    await wrapper.find('.wd-treeselect__filter').setValue('Resume')
    await wrapper.find('.wd-treeselect__toggler').trigger('click')
    await wrapper.findAll('.wd-treeselect__option').find((n) => n.text() === 'Resume')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['resume']])
  })

  it('clears value when clearable and hovered', async () => {
    const wrapper = mount(WdTreeSelect, {
      props: { options, modelValue: 'home', clearable: true, teleport: false },
    })
    await wrapper.find('.wd-select__control').trigger('mouseenter')
    await wrapper.find('.wd-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('supports treeview keyboard navigation and selection', async () => {
    const wrapper = mount(WdTreeSelect, {
      props: { options, modelValue: null, teleport: false },
      attachTo: document.body,
    })
    const triggerEl = wrapper.get('.wd-treeselect__trigger')
    await triggerEl.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const panel = wrapper.get('.wd-treeselect__panel')
    expect(triggerEl.attributes('aria-controls')).toBe(panel.attributes('id'))

    const docsOption = () =>
      wrapper.findAll('.wd-treeselect__option').find((n) => n.text() === 'Documents')!
    expect(document.activeElement).toBe(docsOption().element)

    await panel.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.find('.wd-treeselect__node').attributes('aria-expanded')).toBe('true')

    await panel.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    const resume = wrapper.findAll('.wd-treeselect__option').find((n) => n.text() === 'Resume')!
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
    expect(wrapper.find('.wd-treeselect__panel').exists()).toBe(false)
    expect(document.activeElement).toBe(triggerEl.element)
    wrapper.unmount()
  })

  it('closes on Escape from the panel and restores trigger focus', async () => {
    const wrapper = mount(WdTreeSelect, {
      props: { options, modelValue: null, teleport: false },
      attachTo: document.body,
    })
    const triggerEl = wrapper.get('.wd-treeselect__trigger')
    await triggerEl.trigger('click')
    await nextTick()
    await wrapper.get('.wd-treeselect__panel').trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find('.wd-treeselect__panel').exists()).toBe(false)
    expect(document.activeElement).toBe(triggerEl.element)
    wrapper.unmount()
  })

  it('exposes treeitem aria state', async () => {
    const wrapper = mount(WdTreeSelect, {
      props: { options, modelValue: 'home', teleport: false },
    })
    await wrapper.find('.wd-treeselect__trigger').trigger('click')
    await wrapper.find('.wd-treeselect__toggler').trigger('click')
    const items = wrapper.findAll('.wd-treeselect__node')
    expect(items[0]!.attributes('aria-level')).toBe('1')
    const home = items.find(
      (n) =>
        (n.element as HTMLElement).querySelector(':scope > .wd-treeselect__row .wd-treeselect__option')
          ?.textContent === 'Home',
    )!
    expect(home.attributes('aria-selected')).toBe('true')
    expect(home.attributes('aria-level')).toBe('2')
  })

  it('renders field label and error feedback', () => {
    const wrapper = mount(WdTreeSelect, {
      props: {
        options,
        label: 'Folder',
        errorMessage: 'Required',
      },
    })
    expect(wrapper.get('.wd-select-field__label').text()).toBe('Folder')
    expect(wrapper.get('.wd-select-field__help').text()).toBe('Required')
    expect(wrapper.get('.wd-treeselect').classes()).toContain('wd-treeselect--invalid')
    expect(wrapper.get('.wd-treeselect__trigger').attributes('aria-invalid')).toBe('true')
  })
})
