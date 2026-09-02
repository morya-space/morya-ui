import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WiTable from './Table.vue'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status' },
]

describe('WiTable', () => {
  it('renders columns, row values, and cell slot', () => {
    const wrapper = mount(WiTable, {
      props: {
        columns,
        rows: [{ id: 1, name: 'Landing page', status: 'Draft' }],
        paginator: false,
      },
      slots: { 'cell-status': '<strong>{{ value }}</strong>' },
    })
    expect(wrapper.get('th').text()).toContain('Name')
    expect(wrapper.text()).toContain('Landing page')
    expect(wrapper.get('strong').text()).toBe('Draft')
  })

  it('shows empty message overlay when there are no rows', () => {
    const wrapper = mount(WiTable, {
      props: {
        columns,
        rows: [],
        emptyText: 'Nothing here',
        paginator: false,
      },
    })
    expect(wrapper.get('.wi-table__empty-text').text()).toContain('Nothing here')
  })

  it('uses WiScrollbar for table body scrolling', () => {
    const wrapper = mount(WiTable, {
      props: {
        columns,
        rows: [{ id: 1, name: 'A' }],
        paginator: false,
      },
    })
    expect(wrapper.find('.wi-table__scrollbar.wi-scrollbar').exists()).toBe(true)
  })

  it('applies density size class', () => {
    const wrapper = mount(WiTable, {
      props: {
        columns,
        rows: [{ id: 1, name: 'A' }],
        size: 'lg',
        paginator: false,
      },
    })
    expect(wrapper.classes()).toContain('wi-table--large')
  })

  it('applies striped and bordered modifiers', () => {
    const wrapper = mount(WiTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows: [{ id: 1, name: 'A' }],
        striped: true,
        bordered: true,
        paginator: false,
      },
    })
    expect(wrapper.classes()).toContain('wi-table--striped')
    expect(wrapper.classes()).toContain('wi-table--border')
  })

  it('shows loading overlay', () => {
    const wrapper = mount(WiTable, {
      props: {
        columns,
        rows: [],
        loading: true,
        paginator: false,
      },
    })
    expect(wrapper.find('.wi-table__loading').exists()).toBe(true)
    expect(wrapper.find('.wi-table__message').exists()).toBe(false)
  })

  it('sorts rows when sortable header is clicked', async () => {
    const wrapper = mount(WiTable, {
      props: {
        columns,
        rows: [
          { id: 1, name: 'Lin', status: 'a' },
          { id: 2, name: 'Ada', status: 'b' },
        ],
        paginator: false,
      },
    })
    await wrapper.get('th.wi-table__header-cell--sortable').trigger('click')
    const firstCell = wrapper.find('tbody td').text()
    expect(firstCell).toBe('Ada')
    expect(wrapper.emitted('sort')?.[0]?.[0]).toMatchObject({ sortField: 'name', sortOrder: 'asc' })
  })

  it('emits selection updates in multi-select mode', async () => {
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
        paginator: false,
      },
    })
    await wrapper.findAll('.wi-checkbox__input')[1]!.setValue(true)
    expect(wrapper.emitted('update:selection')?.at(-1)?.[0]).toEqual([rows[0]])
  })

  it('emits selected-item in single-select mode', async () => {
    const rows = [
      { id: 1, name: 'Ada' },
      { id: 2, name: 'Lin' },
    ]
    const wrapper = mount(WiTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows,
        selectionMode: 'single',
        paginator: false,
      },
    })
    await wrapper.findAll('.wi-radio__input')[0]!.setValue(true)
    expect(wrapper.emitted('update:selectedItem')?.at(-1)?.[0]).toEqual(rows[0])
  })

  it('paginates with WiPagination in footer mode', async () => {
    const rows = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `R${i + 1}` }))
    const wrapper = mount(WiTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows,
        rowsPerPage: 2,
        page: 1,
        paginator: true,
      },
    })
    expect(wrapper.find('.wi-pagination').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    const buttons = wrapper.findAll('.wi-pagination__button')
    await buttons.at(-1)!.trigger('click')
    expect(wrapper.text()).toContain('R3')
  })

  it('highlights current row when enabled', async () => {
    const wrapper = mount(WiTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows: [
          { id: 1, name: 'Ada' },
          { id: 2, name: 'Lin' },
        ],
        highlightCurrent: true,
        paginator: false,
      },
    })
    await wrapper.findAll('tbody tr')[0]!.trigger('click')
    expect(wrapper.emitted('update:currentRowKey')?.at(-1)?.[0]).toBe(1)
    expect(wrapper.find('tbody tr.wi-table__row--current').exists()).toBe(true)
  })

  it('renders expansion slot', async () => {
    const wrapper = mount(WiTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows: [{ id: 1, name: 'Ada', extra: 'Design system' }],
        expandable: true,
        paginator: false,
      },
      slots: {
        expansion: ({ row }: { row: { name: string; extra: string } }) =>
          h('p', { class: 'exp' }, `${row.name} ${row.extra}`),
      },
    })
    await wrapper.get('.wi-table__expand-btn').trigger('click')
    expect(wrapper.get('.wi-table__cell--expanded').text()).toContain('Ada Design system')
    expect(wrapper.emitted('expand')).toBeTruthy()
  })

  it('renders column render output', () => {
    const wrapper = mount(WiTable, {
      props: {
        columns: [{ key: 'name', label: 'Name', render: (row: { name: string }) => `*${row.name}*` }],
        rows: [{ id: 1, name: 'Ada' }],
        paginator: false,
      },
    })
    expect(wrapper.text()).toContain('*Ada*')
  })
})
