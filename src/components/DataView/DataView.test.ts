import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import WiDataView from './DataView.vue'

describe('WiDataView', () => {
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
})
