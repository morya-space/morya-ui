import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WiTable from './Table.vue'

const headers = [
  { text: 'Name', value: 'name', sortable: true },
  { text: 'Status', value: 'status' },
]

describe('WiTable', () => {
  it('renders headers, item values, and item slot', () => {
    const wrapper = mount(WiTable, {
      props: {
        headers,
        items: [{ id: 1, name: 'Landing page', status: 'Draft' }],
        hideFooter: true,
      },
      slots: { 'item-status': '<strong>{{ status }}</strong>' },
    })
    expect(wrapper.get('th').text()).toContain('Name')
    expect(wrapper.text()).toContain('Landing page')
    expect(wrapper.get('strong').text()).toBe('Draft')
  })

  it('shows empty message overlay when there are no items', () => {
    const wrapper = mount(WiTable, {
      props: { headers, items: [], emptyMessage: 'Nothing here', hideFooter: true },
    })
    expect(wrapper.get('.wi-table__empty-text').text()).toContain('Nothing here')
  })

  it('uses WiScrollbar for table body scrolling', () => {
    const wrapper = mount(WiTable, {
      props: {
        headers,
        items: [{ id: 1, name: 'A' }],
        hideFooter: true,
      },
    })
    expect(wrapper.find('.wi-table__scrollbar.wi-scrollbar').exists()).toBe(true)
  })

  it('applies density size class', () => {
    const wrapper = mount(WiTable, {
      props: {
        headers,
        items: [{ id: 1, name: 'A' }],
        size: 'lg',
        hideFooter: true,
      },
    })
    expect(wrapper.classes()).toContain('wi-table--large')
  })

  it('applies stripe and border modifiers like Element Plus', () => {
    const wrapper = mount(WiTable, {
      props: {
        headers,
        items: [{ id: 1, name: 'A' }],
        stripe: true,
        border: true,
        hideFooter: true,
      },
    })
    expect(wrapper.classes()).toContain('wi-table--striped')
    expect(wrapper.classes()).toContain('wi-table--border')
  })

  it('shows loading overlay', () => {
    const wrapper = mount(WiTable, {
      props: {
        headers,
        items: [],
        loading: true,
        hideFooter: true,
      },
    })
    expect(wrapper.find('.wi-table__loading').exists()).toBe(true)
    expect(wrapper.find('.wi-table__message').exists()).toBe(false)
  })

  it('sorts items when sortable header is clicked', async () => {
    const wrapper = mount(WiTable, {
      props: {
        headers,
        items: [
          { id: 1, name: 'Lin', status: 'a' },
          { id: 2, name: 'Ada', status: 'b' },
        ],
        hideFooter: true,
      },
    })
    await wrapper.get('th.wi-table__header-cell--sortable').trigger('click')
    const firstCell = wrapper.find('tbody td').text()
    expect(firstCell).toBe('Ada')
    expect(wrapper.emitted('updateSort')?.[0]?.[0]).toMatchObject({ sortBy: 'name', sortType: 'asc' })
  })

  it('emits items-selected updates in multi-select mode with WiCheckbox', async () => {
    const items = [
      { id: 1, name: 'Ada' },
      { id: 2, name: 'Lin' },
    ]
    const wrapper = mount(WiTable, {
      props: {
        headers: [{ text: 'Name', value: 'name' }],
        items,
        selectionMode: 'multiple',
        itemsSelected: [],
        hideFooter: true,
      },
    })
    await wrapper.findAll('.wi-checkbox__input')[1]!.setValue(true)
    expect(wrapper.emitted('update:itemsSelected')?.at(-1)?.[0]).toEqual([items[0]])
  })

  it('emits selected-item in single-select mode with WiRadio', async () => {
    const items = [
      { id: 1, name: 'Ada' },
      { id: 2, name: 'Lin' },
    ]
    const wrapper = mount(WiTable, {
      props: {
        headers: [{ text: 'Name', value: 'name' }],
        items,
        selectionMode: 'single',
        hideFooter: true,
      },
    })
    await wrapper.findAll('.wi-radio__input')[0]!.setValue(true)
    expect(wrapper.emitted('update:selectedItem')?.at(-1)?.[0]).toEqual(items[0])
  })

  it('paginates with WiPagination in footer mode', async () => {
    const items = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `R${i + 1}` }))
    const wrapper = mount(WiTable, {
      props: {
        headers: [{ text: 'Name', value: 'name' }],
        items,
        rowsPerPage: 2,
        currentPage: 1,
      },
    })
    expect(wrapper.find('.wi-pagination').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    const buttons = wrapper.findAll('.wi-pagination__button')
    await buttons.at(-1)!.trigger('click')
    expect(wrapper.text()).toContain('R3')
  })

  it('does not paginate when already on last page', async () => {
    const items = Array.from({ length: 2 }, (_, i) => ({ id: i + 1, name: `R${i + 1}` }))
    const wrapper = mount(WiTable, {
      props: {
        headers: [{ text: 'Name', value: 'name' }],
        items,
        rowsPerPage: 2,
        currentPage: 1,
      },
    })
    const nextButton = wrapper.findAll('.wi-pagination__button').at(-1)!
    expect(nextButton.attributes('disabled')).toBeDefined()
    await nextButton.trigger('click')
    expect(wrapper.text()).toContain('R1')
    expect(wrapper.text()).toContain('R2')
  })

  it('highlights current row when enabled', async () => {
    const wrapper = mount(WiTable, {
      props: {
        headers: [{ text: 'Name', value: 'name' }],
        items: [
          { id: 1, name: 'Ada' },
          { id: 2, name: 'Lin' },
        ],
        highlightCurrentRow: true,
        hideFooter: true,
      },
    })
    await wrapper.findAll('tbody tr')[0]!.trigger('click')
    expect(wrapper.emitted('update:currentRowKey')?.at(-1)?.[0]).toBe(1)
    expect(wrapper.find('tbody tr.wi-table__row--current').exists()).toBe(true)
  })

  it('renders expand slot', async () => {
    const wrapper = mount(WiTable, {
      props: {
        headers: [{ text: 'Name', value: 'name' }],
        items: [{ id: 1, name: 'Ada', extra: 'Design system' }],
        hideFooter: true,
      },
      slots: {
        expand: ({ name }: { name: string }) => h('p', { class: 'exp' }, `${name} extra`),
      },
    })
    await wrapper.get('.wi-table__expand-btn').trigger('click')
    expect(wrapper.get('.wi-table__cell--expanded').text()).toContain('Ada extra')
    expect(wrapper.emitted('expandRow')).toBeTruthy()
  })
})
