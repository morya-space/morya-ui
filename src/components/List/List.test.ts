import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import MList from './List.vue'
import MListItem from './ListItem.vue'
import MListItemMeta from './ListItemMeta.vue'

const sample = [
  { id: '1', title: 'A', desc: 'Alpha' },
  { id: '2', title: 'B', desc: 'Beta' },
  { id: '3', title: 'C', desc: 'Gamma' },
]

describe('muList', () => {
  it('renders dataSource alias and item slot', () => {
    const Comp = defineComponent({
      setup() {
        return () =>
          h(
            MList,
            { dataSource: sample, rowKey: 'id' },
            {
              item: ({ item }: { item: (typeof sample)[0] }) =>
                h(MListItem, null, () =>
                  h(MListItemMeta, { title: item.title, description: item.desc }),
                ),
            },
          )
      },
    })
    const wrapper = mount(Comp)
    expect(wrapper.findAll('.m-list-item')).toHaveLength(3)
    expect(wrapper.text()).toContain('Alpha')
  })

  it('accepts items as primary prop name', () => {
    const wrapper = mount(MList, {
      props: { items: [{ title: 'Only' }] },
      slots: {
        item: ({ item }: { item: { title: string } }) => item.title,
      },
    })
    expect(wrapper.text()).toContain('Only')
  })

  it('shows empty state when items array is empty', () => {
    const wrapper = mount(MList, { props: { items: [] } })
    expect(wrapper.find('.m-list__empty').exists()).toBe(true)
  })

  it('applies bordered and vertical modifiers', () => {
    const wrapper = mount(MList, {
      props: { items: sample, bordered: true, itemLayout: 'vertical' },
    })
    expect(wrapper.find('.m-list').classes()).toEqual(
      expect.arrayContaining(['m-list--bordered', 'm-list--vertical']),
    )
  })

  it('paginates local items', () => {
    const Comp = defineComponent({
      setup() {
        return () =>
          h(
            MList,
            {
              items: sample,
              pagination: { pageSize: 2, page: 1 },
              rowKey: 'id',
            },
            {
              item: ({ item }: { item: (typeof sample)[0] }) => item.title,
            },
          )
      },
    })
    const wrapper = mount(Comp)
    expect(wrapper.text()).toContain('A')
    expect(wrapper.text()).toContain('B')
    expect(wrapper.text()).not.toContain('Gamma')
  })

  it('renders header and footer slots', () => {
    const wrapper = mount(MList, {
      props: { items: sample },
      slots: {
        header: () => 'Header',
        footer: () => 'Footer',
        item: ({ item }: { item: (typeof sample)[0] }) => item.title,
      },
    })
    expect(wrapper.find('.m-list__header').text()).toBe('Header')
    expect(wrapper.find('.m-list__footer').text()).toBe('Footer')
  })

  it('renders list item actions from prop', () => {
    const wrapper = mount(MListItem, {
      props: { actions: ['Edit', 'More'] },
      slots: { default: () => 'Body' },
    })
    expect(wrapper.findAll('.m-list-item__action')).toHaveLength(2)
    expect(wrapper.text()).toContain('Edit')
  })
})
