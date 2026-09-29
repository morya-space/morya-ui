import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import type { TableItem } from './types'
import MTable from './Table.vue'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status' },
]

describe('mTable', () => {
  it('renders columns, row values, and cell slot', () => {
    const wrapper = mount(MTable, {
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
    const wrapper = mount(MTable, {
      props: {
        columns,
        rows: [],
        emptyText: 'Nothing here',
        paginator: false,
      },
    })
    expect(wrapper.get('.m-table__empty-text').text()).toContain('Nothing here')
  })

  it('uses MScrollbar for table body scrolling', () => {
    const wrapper = mount(MTable, {
      props: {
        columns,
        rows: [{ id: 1, name: 'A' }],
        paginator: false,
      },
    })
    expect(wrapper.find('.m-table__scrollbar.m-scrollbar').exists()).toBe(true)
  })

  it('fills parent height so paginator can sit at the page bottom', () => {
    const wrapper = mount(MTable, {
      props: {
        columns,
        rows: [{ id: 1, name: 'A' }],
        fill: true,
        paginator: true,
      },
    })
    expect(wrapper.classes()).toContain('m-table--fill')
    expect(wrapper.find('.m-table__footer').exists()).toBe(true)
  })

  it('applies density size class', () => {
    const wrapper = mount(MTable, {
      props: {
        columns,
        rows: [{ id: 1, name: 'A' }],
        size: 'lg',
        paginator: false,
      },
    })
    expect(wrapper.classes()).toContain('m-table--large')
  })

  it('applies striped and bordered modifiers', () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows: [{ id: 1, name: 'A' }],
        striped: true,
        bordered: true,
        paginator: false,
      },
    })
    expect(wrapper.classes()).toContain('m-table--striped')
    expect(wrapper.classes()).toContain('m-table--border')
  })

  it('shows loading overlay', () => {
    const wrapper = mount(MTable, {
      props: {
        columns,
        rows: [],
        loading: true,
        paginator: false,
      },
    })
    expect(wrapper.find('.m-loading-mask').exists()).toBe(true)
    expect(wrapper.find('.m-loading-indicator').exists()).toBe(true)
    expect(wrapper.find('.m-table__message').exists()).toBe(false)
  })

  it('renders a custom loading slot as the mask indicator', () => {
    const wrapper = mount(MTable, {
      props: {
        columns,
        rows: [],
        loading: true,
        paginator: false,
      },
      slots: { loading: '<em class="custom-loading">载入中</em>' },
    })
    expect(wrapper.get('.m-loading-mask .custom-loading').text()).toBe('载入中')
    expect(wrapper.find('.m-loading-indicator').exists()).toBe(false)
  })

  it('sorts rows when sortable header is clicked', async () => {
    const wrapper = mount(MTable, {
      props: {
        columns,
        rows: [
          { id: 1, name: 'Lin', status: 'a' },
          { id: 2, name: 'Ada', status: 'b' },
        ],
        paginator: false,
      },
    })
    await wrapper.get('th.m-table__header-cell--sortable').trigger('click')
    const firstCell = wrapper.find('tbody td').text()
    expect(firstCell).toBe('Ada')
    expect(wrapper.emitted('sort')?.[0]?.[0]).toMatchObject({ sortField: 'name', sortOrder: 'asc' })
  })

  it('emits selection updates in multi-select mode', async () => {
    const rows = [
      { id: 1, name: 'Ada' },
      { id: 2, name: 'Lin' },
    ]
    const wrapper = mount(MTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows,
        selectionMode: 'multiple',
        selection: [],
        paginator: false,
      },
    })
    await wrapper.findAll('.m-checkbox__input')[1]!.setValue(true)
    expect(wrapper.emitted('update:selection')?.at(-1)?.[0]).toEqual([rows[0]])

    await wrapper.setProps({ selection: [rows[0]] })
    await wrapper.findAll('.m-checkbox__input')[1]!.setValue(false)
    expect(wrapper.emitted('update:selection')?.at(-1)?.[0]).toEqual([])
    expect(wrapper.emitted('deselect-row')?.at(-1)?.[0]).toEqual(rows[0])
  })

  it('emits selected-item in single-select mode', async () => {
    const rows = [
      { id: 1, name: 'Ada' },
      { id: 2, name: 'Lin' },
    ]
    const wrapper = mount(MTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows,
        selectionMode: 'single',
        paginator: false,
      },
    })
    await wrapper.findAll('.m-radio__input')[0]!.setValue(true)
    expect(wrapper.emitted('update:selectedItem')?.at(-1)?.[0]).toEqual(rows[0])
  })

  it('paginates with MPagination in footer mode', async () => {
    const rows = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `R${i + 1}` }))
    const wrapper = mount(MTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows,
        rowsPerPage: 2,
        page: 1,
        paginator: true,
      },
    })
    expect(wrapper.find('.m-pagination').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    const buttons = wrapper.findAll('.m-pagination__button')
    await buttons.at(-1)!.trigger('click')
    expect(wrapper.text()).toContain('R3')
  })

  it('highlights current row when enabled', async () => {
    const wrapper = mount(MTable, {
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
    expect(wrapper.find('tbody tr.m-table__row--current').exists()).toBe(true)
  })

  it('renders expansion slot', async () => {
    const wrapper = mount(MTable, {
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
    await wrapper.get('.m-table__expand-btn').trigger('click')
    expect(wrapper.get('.m-table__cell--expanded').text()).toContain('Ada Design system')
    expect(wrapper.emitted('expand')).toBeTruthy()
  })

  it('renders column render output', () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [{ key: 'name', label: 'Name', render: (row: { name: string }) => `*${row.name}*` }],
        rows: [{ id: 1, name: 'Ada' }],
        paginator: false,
      },
    })
    expect(wrapper.text()).toContain('*Ada*')
  })

  it('sorts numeric columns numerically', async () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [{ key: 'score', label: 'Score', sortable: true }],
        rows: [
          { id: 1, score: 100 },
          { id: 2, score: 9 },
          { id: 3, score: 25 },
        ],
        paginator: false,
      },
    })
    await wrapper.get('th.m-table__header-cell--sortable').trigger('click')
    const cells = wrapper.findAll('tbody td .m-table__cell-text')
    expect(cells.map((cell) => cell.text())).toEqual(['9', '25', '100'])
  })

  it('treats search input as plain text, not regex', () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows: [
          { id: 1, name: 'foo[bar' },
          { id: 2, name: 'baz' },
        ],
        searchValue: '[',
        paginator: false,
      },
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.text()).toContain('foo[bar')
  })

  it('supports v-model:expandedRowKeys and keeps expansion across sorting', async () => {
    const wrapper = mount(MTable, {
      props: {
        'columns': [
          { key: 'name', label: 'Name', sortable: true },
        ],
        'rows': [
          { id: 1, name: 'Lin', extra: 'x' },
          { id: 2, name: 'Ada', extra: 'y' },
        ],
        'expandable': true,
        'expandedRowKeys': [],
        'onUpdate:expandedRowKeys': (keys: Array<string | number>) =>
          wrapper.setProps({ expandedRowKeys: keys }),
        'paginator': false,
      },
      slots: {
        expansion: ({ row }: { row: { extra: string } }) => h('p', { class: 'exp' }, row.extra),
      },
    })
    const expandButtons = wrapper.findAll('.m-table__expand-btn')
    await expandButtons[0]!.trigger('click')
    expect(wrapper.emitted('update:expandedRowKeys')?.at(-1)).toEqual([[1]])
    expect(wrapper.find('.m-table__cell--expanded').exists()).toBe(true)

    await wrapper.get('th.m-table__header-cell--sortable').trigger('click')
    expect(wrapper.find('.m-table__cell--expanded').exists()).toBe(true)
  })

  it('renders right-fixed columns with right offsets', () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'ops', label: 'Ops', fixed: 'right', width: 120 },
        ],
        rows: [{ id: 1, name: 'Ada', ops: 'x' }],
        paginator: false,
      },
    })
    const opsHeader = wrapper.findAll('th').at(-1)!
    expect(opsHeader.attributes('style')).toContain('right: 0px')
    expect(opsHeader.classes()).toContain('m-table__header-cell--shadow-end')
  })

  it('sortMode emit only emits without client sorting', async () => {
    const wrapper = mount(MTable, {
      props: {
        columns,
        sortMode: 'emit' as const,
        rows: [
          { id: 1, name: 'Lin', status: 'a' },
          { id: 2, name: 'Ada', status: 'b' },
        ],
        paginator: false,
      },
    })
    await wrapper.get('th.m-table__header-cell--sortable').trigger('click')
    expect(wrapper.emitted('sort')?.[0]?.[0]).toMatchObject({ sortField: 'name', sortOrder: 'asc' })
    expect(wrapper.find('tbody td').text()).toBe('Lin')
  })

  it('filters rows via controlled filters prop', async () => {
    const wrapper = mount(MTable, {
      props: {
        columns,
        rows: [
          { id: 1, name: 'Ada', status: 'Draft' },
          { id: 2, name: 'Lin', status: 'Live' },
        ],
        filters: { status: 'Live' },
        paginator: false,
      },
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.text()).toContain('Lin')
    await wrapper.setProps({ filters: { status: 'Draft' } })
    expect(wrapper.text()).toContain('Ada')
    expect(wrapper.emitted('filter')).toBeTruthy()
  })

  it('emits update:filters when setFilters is called', async () => {
    const wrapper = mount(MTable, {
      props: {
        columns,
        rows: [
          { id: 1, name: 'Ada', status: 'Draft' },
          { id: 2, name: 'Lin', status: 'Live' },
        ],
        paginator: false,
      },
    })
    ;(wrapper.vm as { setFilters: (value: Record<string, unknown> | null) => void }).setFilters({
      status: 'Live',
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:filters')?.at(-1)).toEqual([{ status: 'Live' }])
    expect(wrapper.emitted('filter')?.at(-1)).toEqual([{ status: 'Live' }])
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
  })

  it('syncs inbound v-model:page after mount', async () => {
    const rows = Array.from({ length: 6 }, (_, i) => ({ id: i + 1, name: `R${i + 1}` }))
    const wrapper = mount(MTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows,
        rowsPerPage: 2,
        page: 1,
        paginator: true,
      },
    })
    expect(wrapper.text()).toContain('R1')
    await wrapper.setProps({ page: 2 })
    expect(wrapper.text()).toContain('R3')
  })

  it('header select-all only selects the current page', async () => {
    const rows = Array.from({ length: 4 }, (_, i) => ({ id: i + 1, name: `R${i + 1}` }))
    const wrapper = mount(MTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows,
        selectionMode: 'multiple',
        selection: [],
        rowsPerPage: 2,
        page: 1,
        paginator: true,
      },
    })
    await wrapper.get('thead .m-checkbox__input').setValue(true)
    const selection = wrapper.emitted('update:selection')?.at(-1)?.[0] as Array<{ id: number }>
    expect(selection.map((row) => row.id)).toEqual([1, 2])
  })

  it('client multiSort accumulates columns', async () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name', sortable: true },
          { key: 'status', label: 'Status', sortable: true },
        ],
        rows: [
          { id: 1, name: 'B', status: 'z' },
          { id: 2, name: 'A', status: 'y' },
          { id: 3, name: 'A', status: 'x' },
        ],
        multiSort: true,
        paginator: false,
      },
    })
    const sortable = wrapper.findAll('th.m-table__header-cell--sortable')
    await sortable[0]!.trigger('click')
    await sortable[1]!.trigger('click')
    expect(wrapper.findAll('.m-table__multi-sort-number')).toHaveLength(2)
    const cells = wrapper.findAll('tbody tr td:first-child .m-table__cell-text')
    expect(cells.map((cell) => cell.text())).toEqual(['A', 'A', 'B'])
  })

  it('server multiSort emits a new serverOptions object', async () => {
    const wrapper = mount(MTable, {
      props: {
        'columns': [
          { key: 'name', label: 'Name', sortable: true },
          { key: 'status', label: 'Status', sortable: true },
        ],
        'rows': [{ id: 1, name: 'Ada', status: 'Live' }],
        'multiSort': true,
        'serverOptions': { page: 1, rowsPerPage: 10, sortBy: [] as string[], sortType: [] as Array<'asc' | 'desc'> },
        'serverTotal': 1,
        'onUpdate:serverOptions': (value: {
          page: number
          rowsPerPage: number
          sortBy?: string | string[]
          sortType?: 'asc' | 'desc' | Array<'asc' | 'desc'>
        }) => wrapper.setProps({ serverOptions: value }),
        'paginator': false,
      },
    })
    const sortable = wrapper.findAll('th.m-table__header-cell--sortable')
    await sortable[0]!.trigger('click')
    await sortable[1]!.trigger('click')
    const payloads = wrapper.emitted('update:serverOptions') ?? []
    expect(payloads.length).toBeGreaterThanOrEqual(2)
    expect(payloads.at(-1)?.[0]).toMatchObject({
      sortBy: ['name', 'status'],
      sortType: ['asc', 'asc'],
    })
  })

  it('puts aria-label on the table element', () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows: [{ id: 1, name: 'Ada' }],
        ariaLabel: 'Projects',
        paginator: false,
      },
    })
    expect(wrapper.get('table').attributes('aria-label')).toBe('Projects')
    expect(wrapper.get('.m-table').attributes('aria-label')).toBeUndefined()
  })

  it('does not let row checkbox field override selection overlay', async () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows: [{ id: 1, name: 'Ada', checkbox: false }],
        selectionMode: 'multiple',
        selection: [{ id: 1, name: 'Ada', checkbox: false }],
        paginator: false,
      },
    })
    expect(wrapper.find('tbody .m-checkbox__input').element).toHaveProperty('checked', true)
  })

  it('renders a resize handle for resizable columns and emits columnWidths', async () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [{ key: 'name', label: 'Name', width: 120, resizable: true }],
        rows: [{ id: 1, name: 'Ada' }],
        paginator: false,
      },
    })
    expect(wrapper.find('.m-table__resize-handle').exists()).toBe(true)
    await wrapper.get('.m-table__resize-handle').trigger('mousedown', { clientX: 100 })
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 140 }))
    window.dispatchEvent(new MouseEvent('mouseup'))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:columnWidths')?.at(-1)?.[0]).toMatchObject({ name: 160 })
  })

  it('applies header filter only after confirm', async () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [
          {
            key: 'status',
            label: 'Status',
            filterable: true,
            filters: [
              { text: 'Draft', value: 'Draft' },
              { text: 'Live', value: 'Live' },
            ],
          },
        ],
        rows: [
          { id: 1, status: 'Draft' },
          { id: 2, status: 'Live' },
        ],
        paginator: false,
      },
      attachTo: document.body,
    })
    await wrapper.get('.m-table__filter-btn').trigger('click')
    await wrapper.vm.$nextTick()
    const panel = document.body.querySelector('.m-table__filter-panel')
    expect(panel).toBeTruthy()
    const buttons = panel!.querySelectorAll('.m-table__filter-actions button')
    await buttons[0]?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    await buttons[1]?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    wrapper.unmount()
  })

  it('shows header filter controls for filterable columns', async () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [
          {
            key: 'status',
            label: 'Status',
            filterable: true,
            filters: [
              { text: 'Draft', value: 'Draft' },
              { text: 'Live', value: 'Live' },
            ],
          },
        ],
        rows: [
          { id: 1, status: 'Draft' },
          { id: 2, status: 'Live' },
        ],
        paginator: false,
      },
      attachTo: document.body,
    })
    expect(wrapper.find('.m-table__filter-btn').exists()).toBe(true)
    await wrapper.get('.m-table__filter-btn').trigger('click')
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.m-table__filter-panel')).toBeTruthy()
    ;(wrapper.vm as { setFilters: (value: Record<string, unknown> | null) => void }).setFilters({
      status: ['Live'],
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.text()).toContain('Live')
    wrapper.unmount()
  })

  it('virtualizes rows when virtual is enabled with a fixed height', async () => {
    const rows = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, name: `R${i + 1}` }))
    const wrapper = mount(MTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows,
        virtual: true,
        virtualRowHeight: 40,
        maxHeight: 200,
        paginator: false,
      },
    })
    expect(wrapper.classes()).toContain('m-table--virtual')
    expect(wrapper.findAll('tbody tr').length).toBeLessThan(rows.length)
    expect(wrapper.find('.m-table__virtual-spacer').exists()).toBe(true)
  })

  it('skips virtualization when expandable', () => {
    const rows = Array.from({ length: 40 }, (_, i) => ({ id: i + 1, name: `R${i + 1}` }))
    const wrapper = mount(MTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows,
        virtual: true,
        maxHeight: 200,
        expandable: true,
        rowsPerPage: 100,
        paginator: false,
      },
      slots: { expansion: '<p>x</p>' },
    })
    expect(wrapper.classes()).not.toContain('m-table--virtual')
    expect(wrapper.findAll('tbody tr').length).toBe(rows.length)
    expect(wrapper.find('.m-table__virtual-spacer').exists()).toBe(false)
  })

  it('hides and reorders columns via props', async () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'role', label: 'Role' },
          { key: 'email', label: 'Email' },
        ],
        rows: [{ id: 1, name: 'Ada', role: 'Eng', email: 'a@x.com' }],
        hiddenColumns: ['role'],
        columnOrder: ['email', 'name'],
        paginator: false,
      },
    })
    const headers = wrapper.findAll('thead th').map((th) => th.text())
    expect(headers).toEqual(['Email', 'Name'])
    expect(wrapper.text()).not.toContain('Eng')
  })

  it('renders multi-level headers and footer rows', () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [
          {
            key: 'info',
            label: 'Info',
            children: [
              { key: 'name', label: 'Name' },
              { key: 'role', label: 'Role' },
            ],
          },
          { key: 'score', label: 'Score' },
        ],
        rows: [
          { id: 1, name: 'Ada', role: 'Eng', score: 10 },
          { id: 2, name: 'Lin', role: 'Design', score: 20 },
        ],
        showFooter: true,
        footerMethod: ({ data }) => [[
          'Total',
          '',
          data.reduce((sum, row) => sum + Number(row.score ?? 0), 0),
        ]],
        paginator: false,
      },
    })
    expect(wrapper.findAll('thead tr')).toHaveLength(2)
    expect(wrapper.get('tfoot').text()).toContain('30')
  })

  it('expands tree nodes with treeConfig and expandedRowKeys', async () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'size', label: 'Size' },
        ],
        rows: [
          {
            id: 1,
            name: 'Apps',
            size: '100kb',
            children: [
              { id: 11, name: 'Vue', size: '25kb' },
              { id: 12, name: 'React', size: '30kb' },
            ],
          },
        ],
        treeConfig: { childrenField: 'children' },
        expandedRowKeys: [],
        'onUpdate:expandedRowKeys': (keys: Array<string | number>) =>
          wrapper.setProps({ expandedRowKeys: keys }),
        paginator: false,
      },
    })
    expect(wrapper.get('table').attributes('role')).toBe('treegrid')
    expect(wrapper.text()).toContain('Apps')
    expect(wrapper.text()).not.toContain('Vue')
    await wrapper.get('.m-table__tree-toggler').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Vue')
    expect(wrapper.emitted('update:expandedRowKeys')?.at(-1)).toEqual([[1]])
    expect(wrapper.findAll('tbody tr')[0]!.attributes('aria-level')).toBe('1')
    expect(wrapper.findAll('tbody tr')[1]!.attributes('aria-level')).toBe('2')
  })

  it('cascades tree checkbox selection and exposes tree helpers', async () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'size', label: 'Size' },
        ],
        rows: [
          {
            id: 1,
            name: 'Apps',
            size: '100kb',
            children: [
              { id: 11, name: 'Vue', size: '25kb' },
              { id: 12, name: 'React', size: '30kb' },
            ],
          },
        ],
        treeConfig: { childrenField: 'children', expandAll: true },
        selectionMode: 'multiple',
        selection: [],
        'onUpdate:selection': (value: TableItem[]) => wrapper.setProps({ selection: value }),
        checkboxConfig: { checkStrictly: false },
        paginator: false,
      },
    })
    await wrapper.vm.$nextTick()
    const checkboxes = wrapper.findAll('tbody .m-checkbox input')
    expect(checkboxes.length).toBeGreaterThan(0)
    await checkboxes[0]!.setValue(true)
    await wrapper.vm.$nextTick()
    const selection = wrapper.props('selection') as TableItem[]
    expect(selection.map((row) => row.id).sort((a, b) => Number(a) - Number(b))).toEqual([1, 11, 12])

    const vm = wrapper.vm as {
      isTreeExpandByRow: (row: TableItem) => boolean
      clearTreeExpand: () => void
      setAllTreeExpand: (expanded: boolean) => Promise<void>
      getTreeExpandRecords: () => TableItem[]
    }
    expect(vm.isTreeExpandByRow({ id: 1, name: 'Apps' })).toBe(true)
    vm.clearTreeExpand()
    await wrapper.vm.$nextTick()
    expect(vm.getTreeExpandRecords()).toEqual([])
    await vm.setAllTreeExpand(true)
    await wrapper.vm.$nextTick()
    expect(vm.getTreeExpandRecords().map((row) => row.id)).toContain(1)
  })

  it('transforms flat parentId rows when treeConfig.transform is set', async () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows: [
          { id: 1, parentId: null, name: 'Root' },
          { id: 11, parentId: 1, name: 'Child' },
        ],
        treeConfig: { transform: true, expandAll: true },
        paginator: false,
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Root')
    expect(wrapper.text()).toContain('Child')
  })

  it('applies spanMethod for merged cells', () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'role', label: 'Role' },
        ],
        rows: [
          { id: 1, name: 'Ada', role: 'Eng' },
          { id: 2, name: 'Lin', role: 'Eng' },
        ],
        spanMethod: ({ column, rowIndex }) => {
          if (column.value === 'role' && rowIndex === 0) return { rowspan: 2, colspan: 1 }
          if (column.value === 'role' && rowIndex === 1) return { rowspan: 0, colspan: 0 }
          return { rowspan: 1, colspan: 1 }
        },
        paginator: false,
      },
    })
    const firstRowCells = wrapper.findAll('tbody tr')[0]!.findAll('td')
    expect(firstRowCells[1]!.attributes('rowspan')).toBe('2')
    expect(wrapper.findAll('tbody tr')[1]!.findAll('td')).toHaveLength(1)
  })

  it('exposes selection and scroll helpers', async () => {
    const wrapper = mount(MTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' },
        ],
        rows: [
          { id: 1, name: 'Ada', status: 'A' },
          { id: 2, name: 'Lin', status: 'B' },
        ],
        selectionMode: 'multiple',
        selection: [],
        'onUpdate:selection': (value: TableItem[]) => wrapper.setProps({ selection: value }),
        maxHeight: 240,
        paginator: false,
      },
    })
    const vm = wrapper.vm as {
      setCheckboxRow: (rows: TableItem | TableItem[], checked: boolean) => void
      getCheckboxRecords: () => TableItem[]
      clearCheckboxRow: () => void
      isCheckedByCheckboxRow: (row: TableItem) => boolean
      scrollToRow: (row: TableItem) => Promise<void>
    }
    vm.setCheckboxRow({ id: 1, name: 'Ada', status: 'A' }, true)
    await wrapper.vm.$nextTick()
    expect(vm.getCheckboxRecords().map((row) => row.id)).toEqual([1])
    expect(vm.isCheckedByCheckboxRow({ id: 1, name: 'Ada' })).toBe(true)
    vm.clearCheckboxRow()
    await wrapper.vm.$nextTick()
    expect(vm.getCheckboxRecords()).toEqual([])
    await vm.scrollToRow({ id: 2, name: 'Lin', status: 'B' })
    expect(wrapper.find('[data-row-key="2"]').exists()).toBe(true)
  })
})
