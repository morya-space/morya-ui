import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TreeSelectNodeItem from './TreeSelectNodeItem.vue'

describe('treeSelectNodeItem', () => {
  it('emits select for leaf nodes', async () => {
    const wrapper = mount(TreeSelectNodeItem, {
      props: {
        node: { key: 'a', label: 'Alpha' },
        depth: 0,
        selectedKeys: [],
        checkedKeys: {},
        expanded: {},
        showCheckbox: false,
        activeKey: null,
      },
    })
    await wrapper.get('.m-treeselect__option').trigger('click')
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
        activeKey: null,
      },
    })
    await wrapper.get('.m-treeselect__toggler').trigger('click')
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
        activeKey: null,
      },
    })
    await wrapper.get('.m-checkbox__input').setValue(true)
    expect(wrapper.emitted('check')?.[0]?.[0]).toMatchObject({ key: 'x' })
  })
})
