import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WiMenubar from './Menubar.vue'

describe('WiMenubar', () => {
  it('opens one-level submenu and runs command', async () => {
    const command = vi.fn()
    const wrapper = mount(WiMenubar, {
      props: {
        model: [
          { label: 'File', items: [{ label: 'Save', command }] },
          { label: 'Edit', command: vi.fn() },
        ],
        teleport: false,
      },
      attachTo: document.body,
    })
    const triggers = wrapper.findAll('.wi-menubar__trigger')
    await triggers[0]!.trigger('click')
    expect(wrapper.find('.wi-menubar__submenu').exists()).toBe(true)
    await wrapper.get('.wi-menubar__subitem').trigger('click')
    expect(command).toHaveBeenCalledOnce()
    expect(wrapper.find('.wi-menubar__submenu').exists()).toBe(false)
    wrapper.unmount()
  })

  it('teleports submenu to body by default', async () => {
    const wrapper = mount(WiMenubar, {
      props: {
        model: [{ label: 'File', items: [{ label: 'Save' }] }],
      },
      attachTo: document.body,
    })
    await wrapper.find('.wi-menubar__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.wi-menubar__submenu--teleported')).toBeTruthy()
    wrapper.unmount()
  })
})
