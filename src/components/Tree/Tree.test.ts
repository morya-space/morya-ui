import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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
})
