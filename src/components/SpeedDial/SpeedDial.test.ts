import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WiSpeedDial from './SpeedDial.vue'

describe('WiSpeedDial', () => {
  it('toggles open state', async () => {
    const wrapper = mount(WiSpeedDial, {
      props: { modelValue: false, model: [{ label: 'Edit', icon: '✎' }] },
    })
    await wrapper.find('.wi-speeddial__button').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
  })

  it('runs item command when open', async () => {
    const command = vi.fn()
    const wrapper = mount(WiSpeedDial, {
      props: {
        modelValue: true,
        model: [{ label: 'Edit', command }],
        teleport: false,
      },
    })
    await wrapper.find('.wi-speeddial__action').trigger('click')
    expect(command).toHaveBeenCalled()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
  })

  it('teleports action list to body by default', async () => {
    const wrapper = mount(WiSpeedDial, {
      props: {
        modelValue: true,
        model: [{ label: 'Edit' }],
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.wi-speeddial__list--teleported')).toBeTruthy()
    wrapper.unmount()
  })
})
