import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WdSpeedDial from './SpeedDial.vue'

describe('WdSpeedDial', () => {
  it('toggles open state', async () => {
    const wrapper = mount(WdSpeedDial, {
      props: { modelValue: false, model: [{ label: 'Edit', icon: '✎' }] },
    })
    await wrapper.find('.wd-speeddial__button').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
  })

  it('runs item command when open', async () => {
    const command = vi.fn()
    const wrapper = mount(WdSpeedDial, {
      props: {
        modelValue: true,
        model: [{ label: 'Edit', command }],
        teleport: false,
      },
    })
    await wrapper.find('.wd-speeddial__action').trigger('click')
    expect(command).toHaveBeenCalled()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
  })

  it('teleports action list to body by default', async () => {
    const wrapper = mount(WdSpeedDial, {
      props: {
        modelValue: true,
        model: [{ label: 'Edit' }],
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.wd-speeddial__list--teleported')).toBeTruthy()
    wrapper.unmount()
  })
})
