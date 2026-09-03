import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import WiTree from './Tree.vue'

const value = [
  {
    key: '0',
    label: 'Documents',
    children: [
      { key: '0-0', label: 'Work' },
      { key: '0-1', label: 'Home' },
    ],
  },
]

describe('wiTree', () => {
  it('expands nodes and selects single key', async () => {
    const wrapper = mount(WiTree, { props: { value, modelValue: null } })
    await wrapper.find('.wi-tree__toggler').trigger('click')
    expect(wrapper.findAll('.wi-tree__label').length).toBeGreaterThan(1)
    await wrapper.findAll('.wi-tree__label')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['0-0'])
  })

  it('supports multiple selectionKeys', async () => {
    const wrapper = mount(WiTree, {
      props: { value, selectionMode: 'multiple', selectionKeys: {} },
    })
    await wrapper.find('.wi-tree__label').trigger('click')
    expect(wrapper.emitted('update:selectionKeys')?.at(-1)).toEqual([{ '0': true }])
  })

  it('checks nodes with cascade', async () => {
    const wrapper = mount(WiTree, {
      props: {
        value,
        showCheckbox: true,
        checkedKeys: {},
        defaultExpandAll: true,
      },
    })
    await wrapper.find('.wi-checkbox__input').setValue(true)
    const keys = wrapper.emitted('update:checkedKeys')?.at(-1)?.[0] as Record<string, boolean>
    expect(keys['0']).toBe(true)
    expect(keys['0-0']).toBe(true)
    expect(keys['0-1']).toBe(true)
  })

  it('filters nodes by label', () => {
    const wrapper = mount(WiTree, {
      props: { value, filter: 'Work', defaultExpandAll: true },
    })
    expect(wrapper.text()).toContain('Work')
    expect(wrapper.text()).toContain('Documents')
  })

  it('shows empty message when filter yields no results', () => {
    const wrapper = mount(WiTree, {
      props: { value, filter: 'missing' },
    })
    expect(wrapper.find('.wi-tree__message').exists()).toBe(true)
    expect(wrapper.find('.wi-tree__empty-text').text()).toBe('暂无数据')
  })

  it('projects checked keys with checkStrategy child', async () => {
    const wrapper = mount(WiTree, {
      props: {
        value,
        showCheckbox: true,
        checkedKeys: {},
        defaultExpandAll: true,
        checkStrategy: 'child',
      },
    })
    await wrapper.find('.wi-checkbox__input').setValue(true)
    const keys = wrapper.emitted('update:checkedKeys')?.at(-1)?.[0] as Record<string, boolean>
    expect(keys['0']).toBeUndefined()
    expect(keys['0-0']).toBe(true)
    expect(keys['0-1']).toBe(true)
  })

  it('emits node-select and node-unselect on single selection', async () => {
    const wrapper = mount(WiTree, {
      props: {
        value,
        modelValue: null,
        'onUpdate:modelValue': (next: string | null) => wrapper.setProps({ modelValue: next }),
      },
    })
    await wrapper.find('.wi-tree__label').trigger('click')
    expect(wrapper.emitted('node-select')?.at(-1)?.[0]).toMatchObject({ key: '0' })
    await wrapper.find('.wi-tree__label').trigger('click')
    expect(wrapper.emitted('node-unselect')?.at(-1)?.[0]).toMatchObject({ key: '0' })
  })

  it('loads lazy children without mutating props', async () => {
    const nodes = [{ key: '0', label: 'Lazy' }]
    const load = vi.fn(async () => [{ key: '0-0', label: 'Loaded child' }])
    const wrapper = mount(WiTree, { props: { value: nodes, lazy: true, load } })
    await wrapper.find('.wi-tree__toggler').trigger('click')
    await flushPromises()
    expect(load).toHaveBeenCalledTimes(1)
    expect(nodes[0]!.children).toBeUndefined()
    expect(wrapper.text()).toContain('Loaded child')
  })

  it('emits node-load-error and keeps the node collapsed when lazy load fails', async () => {
    const nodes = [{ key: '0', label: 'Lazy' }]
    const load = vi.fn(async (): Promise<never[]> => {
      throw new Error('boom')
    })
    const wrapper = mount(WiTree, { props: { value: nodes, lazy: true, load } })
    await wrapper.find('.wi-tree__toggler').trigger('click')
    await flushPromises()
    expect(wrapper.emitted('node-load-error')?.length).toBe(1)
    expect(wrapper.find('[role="treeitem"]').attributes('aria-expanded')).toBe('false')
  })

  it('exposes aria-level and aria-selected on treeitems', async () => {
    const wrapper = mount(WiTree, {
      props: { value, modelValue: '0-0', defaultExpandAll: true },
    })
    const items = wrapper.findAll('[role="treeitem"]')
    expect(items[0]!.attributes('aria-level')).toBe('1')
    expect(items[1]!.attributes('aria-level')).toBe('2')
    expect(items[1]!.attributes('aria-selected')).toBe('true')
    expect(items[0]!.attributes('aria-selected')).toBe('false')
  })

  it('supports tree keyboard navigation with roving tabindex', async () => {
    const wrapper = mount(WiTree, {
      attachTo: document.body,
      props: {
        value,
        modelValue: null,
        'onUpdate:modelValue': (next: string | null) => wrapper.setProps({ modelValue: next }),
      },
    })
    const tree = wrapper.find('ul.wi-tree')
    const items = () => wrapper.findAll('[role="treeitem"]')

    expect(items().length).toBe(1)
    expect(items()[0]!.attributes('tabindex')).toBe('0')

    ;(items()[0]!.element as HTMLElement).focus()
    await tree.trigger('keydown', { key: 'ArrowRight' })
    await flushPromises()
    expect(items().length).toBe(3)
    expect(items()[0]!.attributes('aria-expanded')).toBe('true')

    await tree.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(items()[0]!.attributes('tabindex')).toBe('-1')
    expect(items()[1]!.attributes('tabindex')).toBe('0')
    expect(document.activeElement?.textContent).toContain('Work')

    await tree.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('node-select')?.at(-1)?.[0]).toMatchObject({ key: '0-0' })

    await tree.trigger('keydown', { key: 'ArrowLeft' })
    await nextTick()
    expect(items()[0]!.attributes('tabindex')).toBe('0')

    await tree.trigger('keydown', { key: 'ArrowLeft' })
    await flushPromises()
    expect(items().length).toBe(1)
    expect(items()[0]!.attributes('aria-expanded')).toBe('false')
  })
})
