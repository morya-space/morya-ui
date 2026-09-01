import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MenuNodes from './MenuNodes.vue'

describe('MenuNodes', () => {
  it('activates leaf items and toggles nested groups', async () => {
    const wrapper = mount(MenuNodes, {
      props: {
        items: [
          { label: 'File', items: [{ key: 'save', label: 'Save' }] },
          { label: 'Quit' },
        ],
        depth: 0,
        indent: 16,
        collapsed: false,
        selectedKey: null,
      },
    })

    await wrapper.get('.wi-menu__item--parent').trigger('click')
    expect(wrapper.find('.wi-menu__submenu').exists()).toBe(true)
    await wrapper.get('.wi-menu__submenu .wi-menu__item').trigger('click')
    expect(wrapper.emitted('activate')?.[0]?.[0]).toMatchObject({ label: 'Save' })
  })

  it('renders separator rows', () => {
    const wrapper = mount(MenuNodes, {
      props: {
        items: [{ separator: true }, { label: 'Item' }],
        depth: 0,
        indent: 16,
        collapsed: false,
        selectedKey: null,
      },
    })
    expect(wrapper.find('.wi-menu__separator').exists()).toBe(true)
  })
})
