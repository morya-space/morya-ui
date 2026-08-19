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

describe('WdTreeTable', () => {
  it('renders columns and expands children', async () => {
    const wrapper = mount(WdTreeTable, { props: { columns, value } })
    expect(wrapper.text()).toContain('Applications')
    expect(wrapper.text()).not.toContain('Vue')
    await wrapper.find('.wd-treetable__toggler').trigger('click')
    expect(wrapper.text()).toContain('Vue')
    expect(wrapper.emitted('node-expand')?.length).toBe(1)
  })
})
