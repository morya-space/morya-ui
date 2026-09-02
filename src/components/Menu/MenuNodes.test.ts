import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiMenu from './Menu.vue'

describe('MenuNodes', () => {
  it('activates leaf items and toggles nested groups', async () => {
    const wrapper = mount(WiMenu, {
      props: {
        model: [
          { key: 'file', label: 'File', items: [{ key: 'save', label: 'Save' }] },
          { key: 'quit', label: 'Quit' },
        ],
      },
    })

    await wrapper.get('.wi-menu__item--submenu .wi-menu__item-content').trigger('click')
    expect(wrapper.find('.wi-menu__submenu').exists()).toBe(true)
    await wrapper.get('.wi-menu__submenu .wi-menu__item-content').trigger('click')
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ label: 'Save' })
  })

  it('renders separator rows', () => {
    const wrapper = mount(WiMenu, {
      props: {
        model: [{ separator: true }, { label: 'Item' }],
      },
    })
    expect(wrapper.find('.wi-menu__separator').exists()).toBe(true)
  })
})
