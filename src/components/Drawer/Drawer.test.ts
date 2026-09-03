import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WiDrawer from './Drawer.vue'

describe('wiDrawer', () => {
  it('opens with show event and closes with Escape', async () => {
    const wrapper = mount(WiDrawer, {
      attachTo: document.body,
      props: { modelValue: true, header: 'Menu' },
    })
    await nextTick()
    expect(document.body.querySelector('.wi-drawer')).toBeTruthy()
    expect(wrapper.emitted('show')).toHaveLength(1)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    wrapper.unmount()
  })

  it('closes on mask click when dismissable and via close icon', async () => {
    const wrapper = mount(WiDrawer, {
      attachTo: document.body,
      props: { modelValue: true, header: 'Menu', position: 'right' },
    })
    await nextTick()
    expect(document.body.querySelector('.wi-drawer--right')).toBeTruthy()
    const closeButton = document.body.querySelector('.wi-drawer__close')
    expect(closeButton).toBeTruthy()
    closeButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    wrapper.unmount()

    const masked = mount(WiDrawer, {
      attachTo: document.body,
      props: { modelValue: true, dismissable: false },
    })
    await nextTick()
    document.body.querySelector('.wi-drawer-backdrop')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(masked.emitted('update:modelValue')).toBeUndefined()
    masked.unmount()
  })

  it('emits hide when closing after open', async () => {
    const wrapper = mount(WiDrawer, {
      attachTo: document.body,
      props: { modelValue: true },
    })
    await nextTick()
    await wrapper.setProps({ modelValue: false })
    await nextTick()
    expect(wrapper.emitted('hide')).toHaveLength(1)
    wrapper.unmount()
  })

  it('applies width for side drawers', async () => {
    const wrapper = mount(WiDrawer, {
      attachTo: document.body,
      props: { modelValue: true, width: 320, position: 'right' },
    })
    await nextTick()
    const pane = document.body.querySelector('.wi-drawer') as HTMLElement
    expect(pane.style.width).toBe('320px')
    wrapper.unmount()
  })

  it('respects closeOnEsc=false and emits close', async () => {
    const wrapper = mount(WiDrawer, {
      attachTo: document.body,
      props: { modelValue: true, closeOnEsc: false },
    })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    document.body.querySelector('.wi-drawer__close')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('close')).toEqual([[]])
    wrapper.unmount()
  })

  it('keeps open when beforeClose returns false', async () => {
    const wrapper = mount(WiDrawer, {
      attachTo: document.body,
      props: { modelValue: true, beforeClose: () => false },
    })
    await nextTick()
    document.body.querySelector('.wi-drawer__close')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })
})
