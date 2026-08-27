import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WiTieredMenu from './TieredMenu.vue'

describe('wiTieredMenu', () => {
  it('opens submenu on hover and runs nested command', async () => {
    const command = vi.fn()
    const wrapper = mount(WiTieredMenu, {
      props: {
        model: [
          { label: 'File', items: [{ label: 'Export', command }] },
          { label: 'Help', command: vi.fn() },
        ],
      },
    })
    await wrapper.get('.wi-tieredmenu__row').trigger('mouseenter')
    expect(wrapper.find('.wi-tieredmenu__submenu').exists()).toBe(true)
    await wrapper.get('.wi-tieredmenu__submenu .wi-tieredmenu__item').trigger('click')
    expect(command).toHaveBeenCalledOnce()
  })

  it('teleports popup menu to body by default', async () => {
    const wrapper = mount(WiTieredMenu, {
      props: {
        popup: true,
        modelValue: true,
        model: [{ label: 'File' }],
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.wi-tieredmenu--teleported')).toBeTruthy()
    wrapper.unmount()
  })
})
