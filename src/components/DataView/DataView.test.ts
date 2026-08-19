import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import WdDataView from './DataView.vue'

describe('WdDataView', () => {
  it('renders list layout by default', () => {
    const wrapper = mount(WdDataView, { props: { value: ['A', 'B', 'C'] } })
    expect(wrapper.classes()).toContain('wd-dataview--list')
    expect(wrapper.findAll('.wd-dataview__list-item')).toHaveLength(3)
  })

  it('paginates items when enabled', async () => {
    const wrapper = mount(WdDataView, {
      props: { value: Array.from({ length: 12 }, (_, i) => `Item ${i}`), paginator: true, rows: 5 },
    })
    expect(wrapper.findAll('.wd-dataview__list-item')).toHaveLength(5)
    expect(wrapper.find('.wd-dataview__paginator').exists()).toBe(true)
  })

  it('uses grid slot', () => {
    const wrapper = mount(WdDataView, {
      props: { value: [1, 2], layout: 'grid' },
      slots: {
        grid: ({ items }: { items: unknown[] }) =>
          h('span', { class: 'custom' }, String(items.length)),
      },
    })
    expect(wrapper.find('.custom').text()).toBe('2')
  })
})
