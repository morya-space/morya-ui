import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WiMenu from './Menu.vue'

describe('wiMenu', () => {
  it('invokes command on item click', async () => {
    const command = vi.fn()
    const wrapper = mount(WiMenu, {
      props: {
        model: [
          { label: 'Open', command },
          { separator: true },
          { label: 'Off', disabled: true },
        ],
      },
    })
    const items = wrapper.findAll('.wi-menu__item-content')
    await items[0]!.trigger('click')
    expect(command).toHaveBeenCalledOnce()
    await items[1]!.trigger('click')
    expect(command).toHaveBeenCalledOnce()
    expect(wrapper.find('.wi-menu__separator').exists()).toBe(true)
  })

  it('hides popup until modelValue is true', async () => {
    const wrapper = mount(WiMenu, {
      props: {
        popup: true,
        modelValue: false,
        model: [{ label: 'A' }],
        teleport: false,
      },
    })
    expect(wrapper.find('.wi-menu').exists()).toBe(false)
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.find('.wi-menu').exists()).toBe(true)
  })

  it('teleports popup menu to body by default', async () => {
    const wrapper = mount(WiMenu, {
      props: {
        popup: true,
        modelValue: true,
        model: [{ label: 'A' }],
      },
      attachTo: document.body,
    })
    await nextTick()
    const menu = document.body.querySelector('.wi-menu--teleported') as HTMLElement | null
    expect(menu).toBeTruthy()
    expect(menu?.style.top).not.toBe('')
    wrapper.unmount()
  })

  it('positions popup menu relative to the default-slot trigger', async () => {
    const wrapper = mount(WiMenu, {
      props: {
        popup: true,
        modelValue: true,
        model: [{ label: 'Copy' }],
      },
      slots: {
        default: '<button class="menu-trigger" type="button">Open</button>',
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.find('.wi-menu-popup__anchor').exists()).toBe(true)
    const menu = document.body.querySelector('.wi-menu--teleported') as HTMLElement | null
    expect(menu).toBeTruthy()
    expect(menu?.style.top).not.toBe('')
    expect(menu?.style.left).not.toBe('')
    wrapper.unmount()
  })

  it('nests items, expands submenu, and marks selectedKey', async () => {
    const wrapper = mount(WiMenu, {
      props: {
        model: [{ key: 'file', label: 'File', items: [{ key: 'save', label: 'Save' }] }],
        selectedKey: 'save',
        defaultExpandedKeys: ['file'],
      },
    })
    expect(wrapper.find('.wi-menu__submenu').exists()).toBe(true)
    expect(wrapper.get('.wi-menu__item-content--selected').text()).toContain('Save')
    await wrapper.get('.wi-menu__item-content--selected').trigger('click')
    expect(wrapper.emitted('update:selectedKey')?.at(-1)).toEqual(['save'])
  })

  it('auto-expands path when selectedKey changes', async () => {
    const wrapper = mount(WiMenu, {
      props: {
        model: [{ key: 'file', label: 'File', items: [{ key: 'save', label: 'Save' }] }],
        selectedKey: null,
      },
    })
    expect(wrapper.find('.wi-menu__submenu').exists()).toBe(false)
    await wrapper.setProps({ selectedKey: 'save' })
    expect(wrapper.find('.wi-menu__submenu').exists()).toBe(true)
  })

  it('uses accordion to keep one top-level group open', async () => {
    const wrapper = mount(WiMenu, {
      props: {
        accordion: true,
        model: [
          { key: 'a', label: 'A', items: [{ key: 'a1', label: 'A1' }] },
          { key: 'b', label: 'B', items: [{ key: 'b1', label: 'B1' }] },
        ],
      },
    })
    const parents = wrapper.findAll('.wi-menu__item--submenu > .wi-menu__item-content')
    await parents[0]!.trigger('click')
    expect(wrapper.findAll('.wi-menu__submenu')).toHaveLength(1)
    await parents[1]!.trigger('click')
    expect(wrapper.findAll('.wi-menu__submenu')).toHaveLength(1)
    expect(wrapper.text()).toContain('B1')
  })

  it('marks parent as child-active when nested item selected', async () => {
    const wrapper = mount(WiMenu, {
      props: {
        model: [{ key: 'file', label: 'File', items: [{ key: 'save', label: 'Save' }] }],
        selectedKey: 'save',
        defaultExpandedKeys: ['file'],
      },
    })
    expect(wrapper.find('.wi-menu__item--submenu .wi-menu__item-content--child-active').exists()).toBe(true)
  })

  it('renders embedded class for sidebar menus', () => {
    const wrapper = mount(WiMenu, {
      props: {
        model: [{ label: 'Home' }],
      },
    })
    expect(wrapper.find('.wi-menu--embedded').exists()).toBe(true)
  })

  it('opens horizontal submenu in flyout instead of inline expand', async () => {
    const wrapper = mount(WiMenu, {
      props: {
        mode: 'horizontal',
        model: [{ key: 'products', label: 'Products', items: [{ key: 'cloud', label: 'Cloud' }] }],
      },
    })
    expect(wrapper.find('.wi-menu--horizontal').exists()).toBe(true)
    expect(wrapper.find('.wi-menu__submenu').exists()).toBe(false)
    await wrapper.get('.wi-menu__item-content').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.wi-menu--flyout')).toBeTruthy()
    wrapper.unmount()
  })

  it('supports vertical keyboard navigation with roving tabindex', async () => {
    const wrapper = mount(WiMenu, {
      attachTo: document.body,
      props: {
        model: [
          { key: 'file', label: 'File', items: [{ key: 'save', label: 'Save' }] },
          { key: 'exit', label: 'Exit' },
        ],
      },
    })
    const root = wrapper.get('.wi-menu')
    const contentByText = (text: string) =>
      wrapper.findAll('.wi-menu__item-content').find((node) => node.text().includes(text))!

    expect(contentByText('File').attributes('tabindex')).toBe('0')
    expect(contentByText('Exit').attributes('tabindex')).toBe('-1')
    expect(contentByText('File').attributes('aria-haspopup')).toBe('menu')

    await root.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(contentByText('File').element)

    await root.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.find('.wi-menu__submenu').exists()).toBe(true)

    await root.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(contentByText('Save').element)
    expect(contentByText('Save').attributes('tabindex')).toBe('0')

    await root.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:selectedKey')?.at(-1)).toEqual(['save'])
    wrapper.unmount()
  })

  it('marks the selected leaf with aria-current', () => {
    const wrapper = mount(WiMenu, {
      props: {
        model: [{ key: 'file', label: 'File', items: [{ key: 'save', label: 'Save' }] }],
        selectedKey: 'save',
        defaultExpandedKeys: ['file'],
      },
    })
    const save = wrapper.get('.wi-menu__item-content--selected')
    expect(save.attributes('aria-current')).toBe('page')
  })

  it('closes popup on Escape and returns focus to the trigger', async () => {
    const wrapper = mount(WiMenu, {
      attachTo: document.body,
      props: { popup: true, modelValue: true, model: [{ label: 'A' }], teleport: false },
      slots: { default: '<button class="menu-trigger" type="button">Open</button>' },
    })
    await nextTick()
    await wrapper.get('.wi-menu').trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    expect(document.activeElement).toBe(wrapper.get('.menu-trigger').element)
    wrapper.unmount()
  })
})
