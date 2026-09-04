import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdTreeTable from './TreeTable.vue'

const columns = [
  { field: 'name', header: 'Name' },
  { field: 'size', header: 'Size' },
]

const value = [
  {
    key: '0',
    data: { name: 'Applications', size: '100kb' },
    children: [{ key: '0-0', data: { name: 'Vue', size: '25kb' } }],
  },
]

describe('wdTreeTable', () => {
  it('renders columns and expands children', async () => {
    const wrapper = mount(WdTreeTable, { props: { columns, value } })
    expect(wrapper.text()).toContain('Applications')
    expect(wrapper.text()).not.toContain('Vue')
    await wrapper.find('.wd-treetable__toggler').trigger('click')
    expect(wrapper.text()).toContain('Vue')
    expect(wrapper.emitted('node-expand')?.length).toBe(1)
  })

  it('exposes treegrid semantics with aria-level and aria-expanded', async () => {
    const wrapper = mount(WdTreeTable, { props: { columns, value } })
    expect(wrapper.find('table').attributes('role')).toBe('treegrid')
    const rootRow = wrapper.find('.wd-treetable__row')
    expect(rootRow.attributes('aria-level')).toBe('1')
    expect(rootRow.attributes('aria-expanded')).toBe('false')
    await wrapper.find('.wd-treetable__toggler').trigger('click')
    const rows = wrapper.findAll('.wd-treetable__row')
    expect(rows[0]!.attributes('aria-expanded')).toBe('true')
    expect(rows[1]!.attributes('aria-level')).toBe('2')
    expect(rows[1]!.attributes('aria-expanded')).toBeUndefined()
  })

  it('supports controlled expandedKeys', async () => {
    const wrapper = mount(WdTreeTable, {
      props: {
        columns,
        value,
        expandedKeys: { '0': true },
      },
    })
    expect(wrapper.text()).toContain('Vue')
    await wrapper.find('.wd-treetable__toggler').trigger('click')
    expect(wrapper.emitted('update:expandedKeys')?.at(-1)).toEqual([{}])
  })

  it('shows empty message when value is empty', () => {
    const wrapper = mount(WdTreeTable, { props: { columns, value: [] } })
    expect(wrapper.find('.wd-treetable__message').exists()).toBe(true)
    expect(wrapper.find('.wd-treetable__empty-text').text()).toBe('暂无数据')
  })

  it('supports custom empty slot', () => {
    const wrapper = mount(WdTreeTable, {
      props: { columns, value: [] },
      slots: { empty: '<p class="custom-empty">No rows</p>' },
    })
    expect(wrapper.find('.custom-empty').text()).toBe('No rows')
  })

  it('renders expansion slot content when expanded', async () => {
    const wrapper = mount(WdTreeTable, {
      props: { columns, value, expandedKeys: { '0': true } },
      slots: {
        expansion: '<p class="expansion-content">Extra details</p>',
      },
    })
    expect(wrapper.find('.expansion-content').text()).toBe('Extra details')
    expect(wrapper.find('.wd-treetable__expansion-cell').exists()).toBe(true)
  })
})
