import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WiContextMenu from './ContextMenu.vue'

describe('WiContextMenu', () => {
  it('shows at event position via expose.show and runs command', async () => {
    const command = vi.fn()
    const wrapper = mount(WiContextMenu, {
      props: {
        model: [{ label: 'Copy', command }],
        modelValue: false,
      },
      attachTo: document.body,
    })
    const menu = wrapper.vm as unknown as { show: (event: MouseEvent) => void; hide: () => void }
    menu.show({ clientX: 40, clientY: 60, preventDefault: vi.fn() } as unknown as MouseEvent)
    await wrapper.setProps({ modelValue: true, position: { x: 40, y: 60 } })
    await nextTick()
    const el = document.body.querySelector('.wi-contextmenu') as HTMLElement | null
    expect(el).toBeTruthy()
    expect(el!.style.left).toBe('40px')
    document.body.querySelector('.wi-contextmenu__item')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(command).toHaveBeenCalledOnce()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('hides via expose.hide', async () => {
    const wrapper = mount(WiContextMenu, {
      props: { model: [{ label: 'A' }], modelValue: true, position: { x: 0, y: 0 } },
      attachTo: document.body,
    })
    await nextTick()
    const menu = wrapper.vm as unknown as { show: (event: MouseEvent) => void; hide: () => void }
    menu.hide()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('teleports the menu to body by default', async () => {
    const wrapper = mount(WiContextMenu, {
      props: { model: [{ label: 'A' }], modelValue: true, position: { x: 0, y: 0 } },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.wi-contextmenu--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('opens a nested submenu', async () => {
    const command = vi.fn()
    const wrapper = mount(WiContextMenu, {
      props: {
        model: [{ label: 'More', items: [{ label: 'Copy', command }] }],
        modelValue: true,
        position: { x: 0, y: 0 },
      },
      attachTo: document.body,
    })
    await nextTick()
    document.body.querySelector('.wi-contextmenu__item--parent')!.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    await nextTick()
    expect(document.body.querySelector('.wi-contextmenu__submenu')).toBeTruthy()
    document.body.querySelector('.wi-contextmenu__submenu .wi-contextmenu__item')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(command).toHaveBeenCalledOnce()
    wrapper.unmount()
  })
})
