import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WiConfirmPopup from './ConfirmPopup.vue'

describe('WiConfirmPopup', () => {
  it('emits accept and closes', async () => {
    const wrapper = mount(WiConfirmPopup, {
      props: { modelValue: true, message: 'Delete?', acceptLabel: 'Yes', rejectLabel: 'No' },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.wi-confirmpopup__message')?.textContent).toContain('Delete?')
    const buttons = Array.from(document.body.querySelectorAll('.wi-confirmpopup .wi-button'))
    const accept = buttons.find((btn) => btn.textContent?.includes('Yes'))
    expect(accept).toBeTruthy()
    accept!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('accept')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('emits reject from cancel', async () => {
    const wrapper = mount(WiConfirmPopup, {
      props: { modelValue: true, position: { top: 10, left: 20 } },
      attachTo: document.body,
    })
    await nextTick()
    const buttons = Array.from(document.body.querySelectorAll('.wi-confirmpopup .wi-button'))
    const reject = buttons.find((btn) => btn.textContent?.includes('取消'))
    expect(reject).toBeTruthy()
    reject!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('reject')).toHaveLength(1)
    wrapper.unmount()
  })

  it('teleports popup to body by default', async () => {
    const wrapper = mount(WiConfirmPopup, {
      props: { modelValue: true, message: 'Hi' },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.wi-confirmpopup--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('keeps open when beforeAccept returns false', async () => {
    const wrapper = mount(WiConfirmPopup, {
      props: { modelValue: true, message: 'Sure?', acceptLabel: 'Yes', beforeAccept: () => false, teleport: false },
    })
    const accept = wrapper.findAll('.wi-button').find((btn) => btn.text().includes('Yes'))
    await accept!.trigger('click')
    await nextTick()
    expect(wrapper.emitted('accept')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('.wi-confirmpopup').exists()).toBe(true)
  })
})
