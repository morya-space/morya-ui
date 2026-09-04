import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WdConfirmPopup from './ConfirmPopup.vue'

describe('wdConfirmPopup', () => {
  it('emits accept and closes', async () => {
    const wrapper = mount(WdConfirmPopup, {
      props: { modelValue: true, message: 'Delete?', acceptLabel: 'Yes', rejectLabel: 'No' },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.wd-confirmpopup__message')?.textContent).toContain('Delete?')
    const buttons = Array.from(document.body.querySelectorAll('.wd-confirmpopup .wd-button'))
    const accept = buttons.find((btn) => btn.textContent?.includes('Yes'))
    expect(accept).toBeTruthy()
    accept!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('accept')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('emits reject from cancel', async () => {
    const wrapper = mount(WdConfirmPopup, {
      props: { modelValue: true, position: { top: 10, left: 20 } },
      attachTo: document.body,
    })
    await nextTick()
    const buttons = Array.from(document.body.querySelectorAll('.wd-confirmpopup .wd-button'))
    const reject = buttons.find((btn) => btn.textContent?.includes('取消'))
    expect(reject).toBeTruthy()
    reject!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('reject')).toHaveLength(1)
    wrapper.unmount()
  })

  it('teleports popup to body by default', async () => {
    const wrapper = mount(WdConfirmPopup, {
      props: { modelValue: true, message: 'Hi' },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.wd-confirmpopup--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('keeps open when beforeAccept returns false', async () => {
    const wrapper = mount(WdConfirmPopup, {
      props: { modelValue: true, message: 'Sure?', acceptLabel: 'Yes', beforeAccept: () => false, teleport: false },
    })
    const accept = wrapper.findAll('.wd-button').find((btn) => btn.text().includes('Yes'))
    await accept!.trigger('click')
    await nextTick()
    expect(wrapper.emitted('accept')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('.wd-confirmpopup').exists()).toBe(true)
  })

  it('uses non-modal semantics without aria-modal', async () => {
    const wrapper = mount(WdConfirmPopup, {
      props: { modelValue: true, message: 'Hi' },
      attachTo: document.body,
    })
    await nextTick()
    const panel = document.body.querySelector('.wd-confirmpopup')
    expect(panel?.getAttribute('role')).toBe('alertdialog')
    expect(panel?.getAttribute('aria-modal')).toBeNull()
    wrapper.unmount()
  })

  it('restores focus to the target after closing', async () => {
    const target = document.createElement('button')
    document.body.appendChild(target)
    target.focus()
    const wrapper = mount(WdConfirmPopup, {
      props: { modelValue: true, message: 'Sure?', target },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.activeElement?.classList.contains('wd-confirmpopup')).toBe(true)
    await wrapper.setProps({ modelValue: false })
    await nextTick()
    expect(document.activeElement).toBe(target)
    wrapper.unmount()
    target.remove()
  })

  it('applies acceptSeverity to the accept button', async () => {
    const wrapper = mount(WdConfirmPopup, {
      props: { modelValue: true, message: 'Delete?', acceptLabel: 'Yes', acceptSeverity: 'danger' },
      attachTo: document.body,
    })
    await nextTick()
    const buttons = Array.from(document.body.querySelectorAll('.wd-confirmpopup .wd-button'))
    const accept = buttons.find((btn) => btn.textContent?.includes('Yes'))
    expect(accept?.classList.contains('wd-button--danger')).toBe(true)
    wrapper.unmount()
  })
})
