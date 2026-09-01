import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WiTable from './Table.vue'

describe('wiTable', () => {
  it('renders headers, row values, and a named cell slot', () => {
    const wrapper = mount(WiTable, {
      props: { columns: [{ key: 'name', label: 'Name' }, { key: 'status', label: 'Status' }], rows: [{ id: 1, name: 'Landing page', status: 'Draft' }] },
      slots: { 'cell-status': '<strong>{{ value }}</strong>' },
    })
    expect(wrapper.get('th').text()).toBe('Name')
    expect(wrapper.text()).toContain('Landing page')
    expect(wrapper.get('strong').text()).toBe('Draft')
  })

  it('renders an empty state with the correct colspan', () => {
    const wrapper = mount(WiTable, { props: { columns: [{ key: 'name', label: 'Name' }], rows: [], emptyText: 'Nothing here' } })
    expect(wrapper.get('.wi-table__empty').attributes('colspan')).toBe('1')
    expect(wrapper.text()).toContain('Nothing here')
  })

  it('applies density size classes', () => {
    const wrapper = mount(WiTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows: [{ id: 1, name: 'A' }],
        size: 'lg',
      },
    })
    expect(wrapper.get('table').classes()).toContain('wi-table--large')
    expect(wrapper.classes()).toContain('wi-table-wrapper--large')
  })

  it('shows loading overlay and hides empty while loading', () => {
    const wrapper = mount(WiTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows: [],
        loading: true,
        loadingText: 'Fetching…',
      },
    })
    expect(wrapper.find('.wi-table__empty').exists()).toBe(false)
    expect(wrapper.get('.wi-table__loading').attributes('aria-label')).toBe('Fetching…')
    expect(wrapper.text()).toContain('Fetching…')
  })

  it('sorts rows when a sortable header is clicked', async () => {
    const wrapper = mount(WiTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name', sortable: true },
          { key: 'age', label: 'Age', sortable: true },
        ],
        rows: [
          { id: 1, name: 'Lin', age: 30 },
          { id: 2, name: 'Ada', age: 20 },
        ],
      },
    })
    await wrapper.get('.wi-table__sort').trigger('click')
    const cells = wrapper.findAll('tbody td').map((cell) => cell.text())
    expect(cells[0]).toBe('Ada')
    expect(wrapper.emitted('sort')?.[0]?.[0]).toMatchObject({ sortField: 'name', sortOrder: 'asc' })
  })

  it('renders richer empty content', () => {
    const wrapper = mount(WiTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows: [],
        emptyText: '空空如也',
        emptyDescription: '去创建第一条记录',
      },
    })
    expect(wrapper.get('.wi-table__empty-title').text()).toBe('空空如也')
    expect(wrapper.get('.wi-table__empty-desc').text()).toBe('去创建第一条记录')
  })

  it('emits selection updates in multiple mode', async () => {
    const rows = [
      { id: 1, name: 'Ada' },
      { id: 2, name: 'Lin' },
    ]
    const wrapper = mount(WiTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows,
        selectionMode: 'multiple',
        selection: [],
      },
    })
    await wrapper.findAll('.wi-checkbox__input')[1]!.setValue(true)
    expect(wrapper.emitted('update:selection')?.at(-1)?.[0]).toEqual([rows[0]])
  })

  it('paginates rows', async () => {
    const rows = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `R${i + 1}` }))
    const wrapper = mount(WiTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows,
        paginator: true,
        rowsPerPage: 2,
        page: 1,
      },
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    await wrapper.find('[aria-label="下一页"]').trigger('click')
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([2])
  })

  it('renders a column render function and expands a row', async () => {
    const wrapper = mount(WiTable, {
      props: {
        columns: [{ key: 'name', label: 'Name', render: (row) => `*${row.name}*` }],
        rows: [{ id: 1, name: 'Ada' }],
        expandable: true,
      },
      slots: {
        expansion: ({ row }: { row: Record<string, unknown> }) =>
          h('p', { class: 'exp' }, `${String(row.name)} extra`),
      },
    })
    expect(wrapper.text()).toContain('*Ada*')
    await wrapper.get('.wi-table__expand-btn').trigger('click')
    expect(wrapper.get('.wi-table__expansion').text()).toContain('Ada extra')
    expect(wrapper.emitted('update:expandedRowKeys')?.at(-1)).toEqual([[1]])
  })
})
