import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WiDropdown from './Dropdown.vue'
import type { DropdownItem } from './types'

const items: DropdownItem[] = [
  { value: 'edit', label: '编辑' },
  { value: 'delete', label: '删除' },
]

describe('WiDropdown', () => {
  it('opens, selects an item, and closes (teleports to body by default)', async () => {
    const wrapper = mount(WiDropdown, { props: { items } })

    await wrapper.get('.wi-dropdown__trigger').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    expect(document.body.querySelector('[role="menu"]')).toBeTruthy()
    expect(document.body.querySelector('.wi-dropdown__menu--teleported')).toBeTruthy()

    await (document.body.querySelector('.wi-dropdown__item') as HTMLButtonElement).click()
    expect(wrapper.emitted('select')?.[0]).toEqual([items[0]])
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('closes with Escape and selects with keyboard when teleport is disabled', async () => {
    const wrapper = mount(WiDropdown, { props: { items, modelValue: true, teleport: false } })
    const menu = wrapper.get('[role="menu"]')

    await menu.trigger('keydown', { key: 'ArrowDown' })
    await menu.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')?.[0]).toEqual([items[0]])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])

    await wrapper.setProps({ modelValue: true })
    const reopenedMenu = wrapper.get('[role="menu"]')
    await reopenedMenu.trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
  })

  it('keeps the menu in place when appendTo is self', async () => {
    const wrapper = mount(WiDropdown, { props: { items, modelValue: true, appendTo: 'self' } })
    await nextTick()
    expect(wrapper.find('.wi-dropdown__menu--teleported').exists()).toBe(false)
    expect(wrapper.find('[role="menu"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('does not select disabled items', async () => {
    const wrapper = mount(WiDropdown, { props: { items: [{ ...items[0]!, disabled: true }] } })

    await wrapper.get('.wi-dropdown__trigger').trigger('click')
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    ;(document.body.querySelector('.wi-dropdown__item') as HTMLButtonElement).click()
    expect(wrapper.emitted('select')).toBeUndefined()
    wrapper.unmount()
  })

  it('renders a group and nested submenu', async () => {
    const wrapper = mount(WiDropdown, {
      props: {
        modelValue: true,
        teleport: false,
        items: [
          { type: 'group', label: 'Edit', items: [{ value: 'cut', label: 'Cut' }] },
          { value: 'more', label: 'More', items: [{ value: 'deep', label: 'Deep' }] },
        ],
      },
    })
    expect(wrapper.get('.wi-dropdown__group-label').text()).toBe('Edit')
    await wrapper.get('.wi-dropdown__submenu-wrap').trigger('mouseenter')
    expect(wrapper.get('.wi-dropdown__submenu').text()).toContain('Deep')
    await wrapper.get('.wi-dropdown__submenu .wi-dropdown__item').trigger('click')
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ value: 'deep' })
  })
})
