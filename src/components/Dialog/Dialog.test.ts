import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { setLastPointer } from '../../shared/lastPointer'
import WiDialog from './Dialog.vue'

describe('WiDialog', () => {
  it('closes with Escape and emits lifecycle events', async () => {
    const wrapper = mount(WiDialog, { attachTo: document.body, props: { modelValue: true, title: 'Confirm' } })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(wrapper.emitted('show')).toHaveLength(1)
    wrapper.unmount()
  })

  it('supports close controls and configurable outside clicks', async () => {
    const wrapper = mount(WiDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Confirm', closeOnOutsideClick: false },
    })
    await nextTick()
    const backdrop = document.body.querySelector('.wi-dialog-backdrop')
    const closeButton = document.body.querySelector('.wi-dialog__actions .wi-dialog__action:last-child')
    expect(backdrop).toBeTruthy()
    expect(closeButton).toBeTruthy()
    backdrop!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('close')).toBeUndefined()
    closeButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
  })

  it('accepts header and dismissableMask aliases and corner positions', async () => {
    const wrapper = mount(WiDialog, {
      attachTo: document.body,
      props: { modelValue: true, header: 'Alias title', dismissableMask: false, position: 'topright' },
    })
    await nextTick()
    expect(document.body.querySelector('.wi-dialog__header h2')?.textContent).toBe('Alias title')
    expect(document.body.querySelector('.wi-dialog-backdrop--topright')).toBeTruthy()
    document.body.querySelector('.wi-dialog-backdrop')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('close')).toBeUndefined()
    wrapper.unmount()
  })

  it('toggles maximized state when maximizable', async () => {
    const wrapper = mount(WiDialog, {
      attachTo: document.body,
      props: { modelValue: true, header: 'Workspace', maximizable: true },
    })
    await nextTick()
    const maximizeButton = document.body.querySelector('.wi-dialog__action') as HTMLButtonElement
    expect(maximizeButton?.getAttribute('aria-label')).toBe('最大化')
    maximizeButton.click()
    await nextTick()
    expect(document.body.querySelector('.wi-dialog--maximized')).toBeTruthy()
    expect(wrapper.emitted('maximize')).toHaveLength(1)
    maximizeButton.click()
    await nextTick()
    expect(document.body.querySelector('.wi-dialog--maximized')).toBeFalsy()
    expect(wrapper.emitted('unmaximize')).toHaveLength(1)
    wrapper.unmount()
  })

  it('zooms the panel from the last pointer position', async () => {
    setLastPointer(24, 48)
    const wrapper = mount(WiDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Zoom' },
    })
    await nextTick()
    const backdrop = document.body.querySelector('.wi-dialog-backdrop') as HTMLElement | null
    expect(backdrop?.style.getPropertyValue('--wi-dialog-origin-x')).toBe('24px')
    expect(backdrop?.style.getPropertyValue('--wi-dialog-origin-y')).toBe('48px')
    wrapper.unmount()
  })
})
