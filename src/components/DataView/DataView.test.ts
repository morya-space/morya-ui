import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WiDataView from './DataView.vue'

describe('wiDataView', () => {
  it('renders list layout by default', () => {
    const wrapper = mount(WiDataView, { props: { value: ['A', 'B', 'C'] } })
    expect(wrapper.classes()).toContain('wi-dataview--list')
    expect(wrapper.findAll('.wi-dataview__list-item')).toHaveLength(3)
  })

  it('paginates items when enabled', async () => {
    const wrapper = mount(WiDataView, {
      props: { value: Array.from({ length: 12 }, (_, i) => `Item ${i}`), paginator: true, rows: 5 },
    })
    expect(wrapper.findAll('.wi-dataview__list-item')).toHaveLength(5)
    expect(wrapper.find('.wi-dataview__paginator').exists()).toBe(true)
  })

  it('uses grid slot', () => {
    const wrapper = mount(WiDataView, {
      props: { value: [1, 2], layout: 'grid' },
      slots: {
        grid: ({ items }: { items: unknown[] }) =>
          h('span', { class: 'custom' }, String(items.length)),
      },
    })
    expect(wrapper.find('.custom').text()).toBe('2')
  })

  it('shows default empty message', () => {
    const wrapper = mount(WiDataView, { props: { value: [] } })
    expect(wrapper.find('.wi-dataview__message').exists()).toBe(true)
    expect(wrapper.find('.wi-dataview__empty-text').text()).toBe('暂无数据')
  })

  it('supports custom empty slot', () => {
    const wrapper = mount(WiDataView, {
      props: { value: [] },
      slots: { empty: '<p class="custom-empty">Nothing here</p>' },
    })
    expect(wrapper.find('.custom-empty').text()).toBe('Nothing here')
  })

  it('shows loading overlay', () => {
    const wrapper = mount(WiDataView, {
      props: { value: ['a'], loading: true },
    })
    expect(wrapper.find('.wi-dataview__loading').exists()).toBe(true)
  })

  it('supports controlled page via v-model:page', async () => {
    const wrapper = mount(WiDataView, {
      props: {
        'value': Array.from({ length: 12 }, (_, i) => `Item ${i}`),
        'paginator': true,
        'rows': 5,
        'page': 2,
        'onUpdate:page': (page: number) => wrapper.setProps({ page }),
      },
    })
    expect(wrapper.findAll('.wi-dataview__list-item')).toHaveLength(5)
    expect(wrapper.find('.wi-dataview__list-item').text()).toBe('Item 5')
  })

  it('does not reset page when data is appended', async () => {
    const wrapper = mount(WiDataView, {
      props: {
        'value': Array.from({ length: 12 }, (_, i) => `Item ${i}`),
        'paginator': true,
        'rows': 5,
        'page': 2,
        'onUpdate:page': (page: number) => wrapper.setProps({ page }),
      },
    })
    await wrapper.setProps({
      value: [...Array.from({ length: 12 }, (_, i) => `Item ${i}`), 'Item 12'],
    })
    expect(wrapper.props('page')).toBe(2)
  })

  it('renders header slot', () => {
    const wrapper = mount(WiDataView, {
      props: { value: ['a'] },
      slots: { header: '<div class="header-toolbar">Toolbar</div>' },
    })
    expect(wrapper.find('.wi-dataview__header .header-toolbar').text()).toBe('Toolbar')
  })
})
