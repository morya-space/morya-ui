import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import RdTieredMenu from './TieredMenu.vue'

describe('rdTieredMenu', () => {
  it('opens submenu on hover and runs nested command', async () => {
    const command = vi.fn()
    const wrapper = mount(RdTieredMenu, {
      props: {
        model: [
          { label: 'File', items: [{ label: 'Export', command }] },
          { label: 'Help', command: vi.fn() },
        ],
      },
    })
    await wrapper.get('.rd-tieredmenu__row').trigger('mouseenter')
    expect(wrapper.find('.rd-tieredmenu__submenu').exists()).toBe(true)
    await wrapper.get('.rd-tieredmenu__submenu .rd-tieredmenu__item').trigger('click')
    expect(command).toHaveBeenCalledOnce()
  })

  it('teleports popup menu to body by default', async () => {
    const wrapper = mount(RdTieredMenu, {
      props: {
        popup: true,
        modelValue: true,
        model: [{ label: 'File' }],
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.rd-tieredmenu--teleported')).toBeTruthy()
    wrapper.unmount()
  })
})
