import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WdMenubar from './Menubar.vue'

describe('WdMenubar', () => {
  it('opens one-level submenu and runs command', async () => {
    const command = vi.fn()
    const wrapper = mount(WdMenubar, {
      props: {
        model: [
          { label: 'File', items: [{ label: 'Save', command }] },
          { label: 'Edit', command: vi.fn() },
        ],
        teleport: false,
      },
      attachTo: document.body,
    })
    const triggers = wrapper.findAll('.wd-menubar__trigger')
    await triggers[0]!.trigger('click')
    expect(wrapper.find('.wd-menubar__submenu').exists()).toBe(true)
    await wrapper.get('.wd-menubar__subitem').trigger('click')
    expect(command).toHaveBeenCalledOnce()
    expect(wrapper.find('.wd-menubar__submenu').exists()).toBe(false)
    wrapper.unmount()
  })

  it('teleports submenu to body by default', async () => {
    const wrapper = mount(WdMenubar, {
      props: {
        model: [{ label: 'File', items: [{ label: 'Save' }] }],
      },
      attachTo: document.body,
    })
    await wrapper.find('.wd-menubar__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.wd-menubar__submenu--teleported')).toBeTruthy()
    wrapper.unmount()
  })
})
