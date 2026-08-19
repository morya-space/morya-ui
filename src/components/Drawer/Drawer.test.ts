import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WdDrawer from './Drawer.vue'

describe('WdDrawer', () => {
  it('opens with show event and closes with Escape', async () => {
    const wrapper = mount(WdDrawer, {
      attachTo: document.body,
      props: { modelValue: true, header: 'Menu' },
    })
    await nextTick()
    expect(document.body.querySelector('.wd-drawer')).toBeTruthy()
    expect(wrapper.emitted('show')).toHaveLength(1)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    wrapper.unmount()
  })

  it('closes on mask click when dismissable and via close icon', async () => {
    const wrapper = mount(WdDrawer, {
      attachTo: document.body,
      props: { modelValue: true, header: 'Menu', position: 'right' },
    })
    await nextTick()
    expect(document.body.querySelector('.wd-drawer--right')).toBeTruthy()
    const closeButton = document.body.querySelector('.wd-drawer__close')
    expect(closeButton).toBeTruthy()
    closeButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    wrapper.unmount()

    const masked = mount(WdDrawer, {
      attachTo: document.body,
      props: { modelValue: true, dismissable: false },
    })
    await nextTick()
    document.body.querySelector('.wd-drawer-backdrop')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(masked.emitted('update:modelValue')).toBeUndefined()
    masked.unmount()
  })

  it('emits hide when closing after open', async () => {
    const wrapper = mount(WdDrawer, {
      attachTo: document.body,
      props: { modelValue: true },
    })
    await nextTick()
    await wrapper.setProps({ modelValue: false })
    await nextTick()
    expect(wrapper.emitted('hide')).toHaveLength(1)
    wrapper.unmount()
  })
})
