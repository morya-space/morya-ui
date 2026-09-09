import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import MTieredMenu from './TieredMenu.vue'

describe('muTieredMenu', () => {
  it('opens submenu on hover and runs nested command', async () => {
    const command = vi.fn()
    const wrapper = mount(MTieredMenu, {
      props: {
        model: [
          { label: 'File', items: [{ label: 'Export', command }] },
          { label: 'Help', command: vi.fn() },
        ],
      },
    })
    await wrapper.get('.m-tieredmenu__row').trigger('mouseenter')
    expect(wrapper.find('.m-tieredmenu__submenu').exists()).toBe(true)
    await wrapper.get('.m-tieredmenu__submenu .m-tieredmenu__item').trigger('click')
    expect(command).toHaveBeenCalledOnce()
  })

  it('teleports popup menu to body by default', async () => {
    const wrapper = mount(MTieredMenu, {
      props: {
        popup: true,
        modelValue: true,
        model: [{ label: 'File' }],
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.m-tieredmenu--teleported')).toBeTruthy()
    wrapper.unmount()
  })
})
