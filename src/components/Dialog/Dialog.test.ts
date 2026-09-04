import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { setLastPointer } from '../../shared/lastPointer'
import WdDialog from './Dialog.vue'

describe('wdDialog', () => {
  it('closes with Escape and emits lifecycle events', async () => {
    const wrapper = mount(WdDialog, { attachTo: document.body, props: { modelValue: true, title: 'Confirm' } })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(wrapper.emitted('show')).toHaveLength(1)
    wrapper.unmount()
  })

  it('supports close controls and configurable outside clicks', async () => {
    const wrapper = mount(WdDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Confirm', closeOnOutsideClick: false },
    })
    await nextTick()
    const backdrop = document.body.querySelector('.wd-dialog-backdrop')
    const closeButton = document.body.querySelector('.wd-dialog__actions .wd-dialog__action:last-child')
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
    const wrapper = mount(WdDialog, {
      attachTo: document.body,
      props: { modelValue: true, header: 'Alias title', dismissableMask: false, position: 'topright' },
    })
    await nextTick()
    expect(document.body.querySelector('.wd-dialog__header h2')?.textContent).toBe('Alias title')
    expect(document.body.querySelector('.wd-dialog-backdrop--topright')).toBeTruthy()
    document.body.querySelector('.wd-dialog-backdrop')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('close')).toBeUndefined()
    wrapper.unmount()
  })

  it('toggles maximized state when maximizable', async () => {
    const wrapper = mount(WdDialog, {
      attachTo: document.body,
      props: { modelValue: true, header: 'Workspace', maximizable: true },
    })
    await nextTick()
    const maximizeButton = document.body.querySelector('.wd-dialog__action') as HTMLButtonElement
    expect(maximizeButton?.getAttribute('aria-label')).toBe('最大化')
    maximizeButton.click()
    await nextTick()
    expect(document.body.querySelector('.wd-dialog--maximized')).toBeTruthy()
    expect(wrapper.emitted('maximize')).toHaveLength(1)
    maximizeButton.click()
    await nextTick()
    expect(document.body.querySelector('.wd-dialog--maximized')).toBeFalsy()
    expect(wrapper.emitted('unmaximize')).toHaveLength(1)
    wrapper.unmount()
  })

  it('zooms the panel from the last pointer position', async () => {
    setLastPointer(24, 48)
    const wrapper = mount(WdDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Zoom' },
    })
    await nextTick()
    const backdrop = document.body.querySelector('.wd-dialog-backdrop') as HTMLElement | null
    expect(backdrop?.style.getPropertyValue('--wd-dialog-origin-x')).toBe('24px')
    expect(backdrop?.style.getPropertyValue('--wd-dialog-origin-y')).toBe('48px')
    wrapper.unmount()
  })

  it('renders a type icon and preset footer actions', async () => {
    const wrapper = mount(WdDialog, {
      attachTo: document.body,
      props: { modelValue: true, header: 'Save', type: 'info', positiveText: '保存', negativeText: '取消' },
    })
    await nextTick()
    expect(document.body.querySelector('.wd-dialog--info')).toBeTruthy()
    expect(document.body.querySelector('.wd-dialog__type-icon')).toBeTruthy()
    const labels = Array.from(document.body.querySelectorAll('.wd-dialog__footer--preset .wd-button')).map(
      (btn) => btn.textContent?.trim(),
    )
    expect(labels).toEqual(expect.arrayContaining(['保存', '取消']))
    wrapper.unmount()
  })

  it('keeps the dialog open when beforeClose returns false', async () => {
    const wrapper = mount(WdDialog, {
      attachTo: document.body,
      props: { modelValue: true, header: 'Stay', beforeClose: () => false },
    })
    await nextTick()
    document.body.querySelector('.wd-dialog__action')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('close')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('keeps the dialog open when onPositiveClick returns false', async () => {
    const wrapper = mount(WdDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        header: 'Save',
        positiveText: '保存',
        onPositiveClick: () => false,
      },
    })
    await nextTick()
    const save = Array.from(document.body.querySelectorAll('.wd-dialog__footer .wd-button')).find((btn) =>
      btn.textContent?.includes('保存'),
    )
    save!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('close')).toBeUndefined()
    wrapper.unmount()
  })

  it('closes after an async onPositiveClick resolves', async () => {
    const wrapper = mount(WdDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        header: 'Save',
        positiveText: '保存',
        onPositiveClick: async () => undefined,
      },
    })
    await nextTick()
    const save = Array.from(document.body.querySelectorAll('.wd-dialog__footer .wd-button')).find((btn) =>
      btn.textContent?.includes('保存'),
    )
    save!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('uses ariaLabel prop and exposes close/maximize helpers', async () => {
    const wrapper = mount(WdDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        ariaLabel: 'Custom dialog label',
        maximizable: true,
      },
    })
    await nextTick()
    expect(document.body.querySelector('.wd-dialog')?.getAttribute('aria-label')).toBe(
      'Custom dialog label',
    )
    await (wrapper.vm as { close: () => void }).close()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    await (wrapper.vm as { maximize: () => void }).maximize()
    await nextTick()
    expect(document.body.querySelector('.wd-dialog--maximized')).toBeTruthy()
    await (wrapper.vm as { unmaximize: () => void }).unmaximize()
    await nextTick()
    expect(document.body.querySelector('.wd-dialog--maximized')).toBeFalsy()
    wrapper.unmount()
  })
})
