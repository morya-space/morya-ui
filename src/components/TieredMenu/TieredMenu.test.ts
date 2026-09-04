import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WdTieredMenu from './TieredMenu.vue'

describe('wdTieredMenu', () => {
  it('opens submenu on hover and runs nested command', async () => {
    const command = vi.fn()
    const wrapper = mount(WdTieredMenu, {
      props: {
        model: [
          { label: 'File', items: [{ label: 'Export', command }] },
          { label: 'Help', command: vi.fn() },
        ],
      },
    })
    await wrapper.get('.wd-tieredmenu__row').trigger('mouseenter')
    expect(wrapper.find('.wd-tieredmenu__submenu').exists()).toBe(true)
    await wrapper.get('.wd-tieredmenu__submenu .wd-tieredmenu__item').trigger('click')
    expect(command).toHaveBeenCalledOnce()
  })

  it('teleports popup menu to body by default', async () => {
    const wrapper = mount(WdTieredMenu, {
      props: {
        popup: true,
        modelValue: true,
        model: [{ label: 'File' }],
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.wd-tieredmenu--teleported')).toBeTruthy()
    wrapper.unmount()
  })
})
