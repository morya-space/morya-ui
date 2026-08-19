import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WdDropdown from './Dropdown.vue'
import type { DropdownItem } from './types'

const items: DropdownItem[] = [
  { value: 'edit', label: '编辑' },
  { value: 'delete', label: '删除' },
]

describe('WdDropdown', () => {
  it('opens, selects an item, and closes (teleports to body by default)', async () => {
    const wrapper = mount(WdDropdown, { props: { items } })

    await wrapper.get('.wd-dropdown__trigger').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    expect(document.body.querySelector('[role="menu"]')).toBeTruthy()
    expect(document.body.querySelector('.wd-dropdown__menu--teleported')).toBeTruthy()

    await (document.body.querySelector('.wd-dropdown__item') as HTMLButtonElement).click()
    expect(wrapper.emitted('select')?.[0]).toEqual([items[0]])
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('closes with Escape and selects with keyboard when teleport is disabled', async () => {
    const wrapper = mount(WdDropdown, { props: { items, modelValue: true, teleport: false } })
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
    const wrapper = mount(WdDropdown, { props: { items, modelValue: true, appendTo: 'self' } })
    await nextTick()
    expect(wrapper.find('.wd-dropdown__menu--teleported').exists()).toBe(false)
    expect(wrapper.find('[role="menu"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('does not select disabled items', async () => {
    const wrapper = mount(WdDropdown, { props: { items: [{ ...items[0]!, disabled: true }] } })

    await wrapper.get('.wd-dropdown__trigger').trigger('click')
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    ;(document.body.querySelector('.wd-dropdown__item') as HTMLButtonElement).click()
    expect(wrapper.emitted('select')).toBeUndefined()
    wrapper.unmount()
  })
})
