import type { DropdownItem } from './types'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import MDropdown from './Dropdown.vue'

const items: DropdownItem[] = [
  { value: 'edit', label: '编辑' },
  { value: 'delete', label: '删除' },
]

describe('muDropdown', () => {
  it('opens, selects an item, and closes (teleports to body by default)', async () => {
    const wrapper = mount(MDropdown, { props: { items } })

    await wrapper.get('.m-dropdown__trigger').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    expect(document.body.querySelector('[role="menu"]')).toBeTruthy()
    expect(document.body.querySelector('.m-dropdown__menu--teleported')).toBeTruthy()

    await (document.body.querySelector('.m-dropdown__item') as HTMLButtonElement).click()
    expect(wrapper.emitted('select')?.[0]).toEqual([items[0]])
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('closes with Escape and selects with keyboard when teleport is disabled', async () => {
    const wrapper = mount(MDropdown, { props: { items, modelValue: true, teleport: false } })
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
    const wrapper = mount(MDropdown, { props: { items, modelValue: true, appendTo: 'self' } })
    await nextTick()
    expect(wrapper.find('.m-dropdown__menu--teleported').exists()).toBe(false)
    expect(wrapper.find('[role="menu"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('does not select disabled items', async () => {
    const wrapper = mount(MDropdown, { props: { items: [{ ...items[0]!, disabled: true }] } })

    await wrapper.get('.m-dropdown__trigger').trigger('click')
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    ;(document.body.querySelector('.m-dropdown__item') as HTMLButtonElement).click()
    expect(wrapper.emitted('select')).toBeUndefined()
    wrapper.unmount()
  })

  it('renders a group and nested submenu', async () => {
    const wrapper = mount(MDropdown, {
      props: {
        modelValue: true,
        teleport: false,
        items: [
          { type: 'group', label: 'Edit', items: [{ value: 'cut', label: 'Cut' }] },
          { value: 'more', label: 'More', items: [{ value: 'deep', label: 'Deep' }] },
        ],
      },
    })
    expect(wrapper.get('.m-dropdown__group-label').text()).toBe('Edit')
    await wrapper.get('.m-dropdown__submenu-wrap').trigger('mouseenter')
    const submenu = document.body.querySelector('.m-dropdown__submenu--teleported')
    expect(submenu?.textContent).toContain('Deep')
    await submenu!.querySelector('.m-dropdown__item')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ value: 'deep' })
    wrapper.unmount()
  })

  it('stays open while a teleported submenu panel is hovered (hover trigger)', async () => {
    document.body.innerHTML = ''
    vi.useFakeTimers()
    const wrapper = mount(MDropdown, {
      props: {
        modelValue: true,
        trigger: 'hover',
        hideDelay: 200,
        items: [{ value: 'more', label: 'More', items: [{ value: 'deep', label: 'Deep' }] }],
      },
      attachTo: document.body,
    })
    await nextTick()
    const menu = document.body.querySelector('.m-dropdown__menu') as HTMLElement
    const wrap = menu.querySelector('.m-dropdown__submenu-wrap') as HTMLElement
    wrap.dispatchEvent(new MouseEvent('mouseenter'))
    await nextTick()
    const submenu = document.body.querySelector('.m-dropdown__submenu--teleported') as HTMLElement
    expect(submenu).toBeTruthy()

    // Moving from the menu into the teleported panel fires the menu's
    // mouseleave; the panel's mouseenter must cancel the pending close.
    menu.dispatchEvent(new MouseEvent('mouseleave'))
    submenu.dispatchEvent(new MouseEvent('mouseenter'))
    await nextTick()
    await vi.advanceTimersByTimeAsync(300)
    expect(wrapper.emitted('update:modelValue') ?? []).not.toContainEqual([false])
    expect(document.body.querySelector('.m-dropdown__submenu--teleported')).toBeTruthy()

    // Leaving the panel to the outside closes the whole hover menu.
    submenu.dispatchEvent(new MouseEvent('mouseleave'))
    await vi.advanceTimersByTimeAsync(250)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    vi.useRealTimers()
    wrapper.unmount()
  })
})
