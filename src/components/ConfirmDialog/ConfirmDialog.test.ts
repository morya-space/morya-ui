import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WdConfirmDialog from './ConfirmDialog.vue'

describe('WdConfirmDialog', () => {
  it('emits accept and closes', async () => {
    const wrapper = mount(WdConfirmDialog, {
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
    const buttons = Array.from(document.body.querySelectorAll('.wd-confirmdialog .wd-button'))
    const accept = buttons.find((btn) => btn.textContent?.includes('Yes'))
    expect(accept).toBeTruthy()
    accept!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('accept')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('emits reject on cancel', async () => {
    const wrapper = mount(WdConfirmDialog, {
      props: { modelValue: true, message: 'Confirm?' },
      attachTo: document.body,
    })
    await nextTick()
    const buttons = Array.from(document.body.querySelectorAll('.wd-confirmdialog .wd-button'))
    const reject = buttons.find((btn) => btn.textContent?.includes('取消'))
    expect(reject).toBeTruthy()
    reject!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('reject')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('teleports dialog to body by default', async () => {
    const wrapper = mount(WdConfirmDialog, {
      props: { modelValue: true, message: 'Confirm?' },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.wd-confirmdialog')).toBeTruthy()
    expect(wrapper.find('.wd-confirmdialog').exists()).toBe(false)
    wrapper.unmount()
  })
})
