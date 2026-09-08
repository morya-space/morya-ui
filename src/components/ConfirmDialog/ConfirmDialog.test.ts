import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WkConfirmDialog from './ConfirmDialog.vue'

describe('wkConfirmDialog', () => {
  it('emits accept and closes', async () => {
    const wrapper = mount(WkConfirmDialog, {
      props: {
        modelValue: true,
        header: 'Delete',
        message: 'Are you sure?',
        acceptLabel: 'Yes',
        rejectLabel: 'No',
      },
      attachTo: document.body,
    })
    await nextTick()
    const buttons = Array.from(document.body.querySelectorAll('.wk-confirmdialog .wk-button'))
    const accept = buttons.find((btn) => btn.textContent?.includes('Yes'))
    expect(accept).toBeTruthy()
    accept!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('accept')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('emits reject on cancel', async () => {
    const wrapper = mount(WkConfirmDialog, {
      props: { modelValue: true, message: 'Confirm?' },
      attachTo: document.body,
    })
    await nextTick()
    const buttons = Array.from(document.body.querySelectorAll('.wk-confirmdialog .wk-button'))
    const reject = buttons.find((btn) => btn.textContent?.includes('取消'))
    expect(reject).toBeTruthy()
    reject!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('reject')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('teleports dialog to body by default', async () => {
    const wrapper = mount(WkConfirmDialog, {
      props: { modelValue: true, message: 'Confirm?' },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.wk-confirmdialog')).toBeTruthy()
    expect(wrapper.find('.wk-confirmdialog').exists()).toBe(false)
    wrapper.unmount()
  })

  it('shows a type icon and keeps open when beforeAccept returns false', async () => {
    const wrapper = mount(WkConfirmDialog, {
      props: {
        modelValue: true,
        message: 'Delete this?',
        type: 'error',
        beforeAccept: () => false,
        acceptLabel: 'Yes',
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.wk-dialog--error .wk-dialog__type-icon')).toBeTruthy()
    const accept = Array.from(document.body.querySelectorAll('.wk-confirmdialog .wk-button')).find((btn) =>
      btn.textContent?.includes('Yes'),
    )
    accept!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('accept')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('ignores mask click when closeOnOutsideClick is false', async () => {
    const wrapper = mount(WkConfirmDialog, {
      props: { modelValue: true, message: 'Confirm?', closeOnOutsideClick: false },
      attachTo: document.body,
    })
    await nextTick()
    document.body.querySelector('.wk-dialog-zoom')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('reject')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('useConfirm', () => {
  it('resolves true on accept and false on reject', async () => {
    const { useConfirm } = await import('./useConfirm')
    const confirm = useConfirm()
    const pending = confirm.require({ message: 'Proceed?', acceptLabel: 'Go', rejectLabel: 'Stop' })
    await nextTick()
    const buttons = Array.from(document.body.querySelectorAll('.wk-confirmdialog .wk-button'))
    const accept = buttons.find((btn) => btn.textContent?.includes('Go'))
    accept!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await expect(pending).resolves.toBe(true)

    const pendingReject = confirm.require({ message: 'Again?', rejectLabel: 'No' })
    await nextTick()
    const reject = Array.from(document.body.querySelectorAll('.wk-confirmdialog .wk-button')).find((btn) =>
      btn.textContent?.includes('No'),
    )
    reject!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await expect(pendingReject).resolves.toBe(false)
  })
})
