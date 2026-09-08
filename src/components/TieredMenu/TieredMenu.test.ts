import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WkTieredMenu from './TieredMenu.vue'

describe('wkTieredMenu', () => {
  it('opens submenu on hover and runs nested command', async () => {
    const command = vi.fn()
    const wrapper = mount(WkTieredMenu, {
      props: {
        model: [
          { label: 'File', items: [{ label: 'Export', command }] },
          { label: 'Help', command: vi.fn() },
        ],
      },
    })
    await wrapper.get('.wk-tieredmenu__row').trigger('mouseenter')
    expect(wrapper.find('.wk-tieredmenu__submenu').exists()).toBe(true)
    await wrapper.get('.wk-tieredmenu__submenu .wk-tieredmenu__item').trigger('click')
    expect(command).toHaveBeenCalledOnce()
  })

  it('teleports popup menu to body by default', async () => {
    const wrapper = mount(WkTieredMenu, {
      props: {
        popup: true,
        modelValue: true,
        model: [{ label: 'File' }],
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.wk-tieredmenu--teleported')).toBeTruthy()
    wrapper.unmount()
  })
})
