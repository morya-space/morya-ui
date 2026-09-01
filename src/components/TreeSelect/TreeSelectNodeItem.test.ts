import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import TreeSelectNodeItem from './TreeSelectNodeItem.vue'

describe('TreeSelectNodeItem', () => {
  it('emits select for leaf nodes', async () => {
    const wrapper = mount(TreeSelectNodeItem, {
      props: {
        node: { key: 'a', label: 'Alpha' },
        depth: 0,
        selectedKeys: [],
        checkedKeys: {},
        expanded: {},
        showCheckbox: false,
      },
    })
    await wrapper.get('.wi-treeselect__option').trigger('click')
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ key: 'a' })
  })

  it('toggles expand for branch nodes', async () => {
    const wrapper = mount(TreeSelectNodeItem, {
      props: {
        node: { key: 'p', label: 'Parent', children: [{ key: 'c', label: 'Child' }] },
        depth: 0,
        selectedKeys: [],
        checkedKeys: {},
        expanded: { p: false },
        showCheckbox: false,
      },
    })
    await wrapper.get('.wi-treeselect__toggler').trigger('click')
    expect(wrapper.emitted('toggle')?.[0]).toEqual(['p'])
  })

  it('emits check when checkbox mode is on', async () => {
    const wrapper = mount(TreeSelectNodeItem, {
      props: {
        node: { key: 'x', label: 'X' },
        depth: 0,
        selectedKeys: [],
        checkedKeys: {},
        expanded: {},
        showCheckbox: true,
      },
    })
    await wrapper.get('.wi-checkbox__input').setValue(true)
    expect(wrapper.emitted('check')?.[0]?.[0]).toMatchObject({ key: 'x' })
  })
})
