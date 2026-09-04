import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TreeTableRow from './TreeTableRow.vue'

describe('TreeTableRow', () => {
  it('renders node data and toggler for branches', async () => {
    const wrapper = mount(TreeTableRow, {
      props: {
        node: {
          key: '1',
          data: { name: 'Root', size: '10' },
          children: [{ key: '1-1', data: { name: 'Child', size: '2' } }],
        },
        columns: [
          { field: 'name', header: 'Name' },
          { field: 'size', header: 'Size' },
        ],
        depth: 0,
        isExpanded: () => true,
      },
    })
    expect(wrapper.get('.wd-treetable__tree-cell').text()).toContain('Root')
    expect(wrapper.findAll('.wd-treetable__row').length).toBeGreaterThan(1)
  })

  it('emits toggle when expand button is clicked', async () => {
    const wrapper = mount(TreeTableRow, {
      props: {
        node: {
          key: '1',
          data: { name: 'Root' },
          children: [{ key: '1-1', data: { name: 'Child' } }],
        },
        columns: [{ field: 'name', header: 'Name' }],
        depth: 0,
        isExpanded: () => false,
      },
    })
    await wrapper.get('.wd-treetable__toggler').trigger('click')
    expect(wrapper.emitted('toggle')?.[0]?.[0]).toMatchObject({ key: '1' })
  })
})
