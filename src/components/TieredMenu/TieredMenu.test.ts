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
      attachTo: document.body,
    })
    await wrapper.get('.m-tiered-menu__row').trigger('mouseenter')
    expect(document.body.querySelector('.m-tiered-menu__submenu--teleported')).toBeTruthy()
    ;(document.body.querySelector('.m-tiered-menu__submenu--teleported .m-tiered-menu__item') as HTMLButtonElement).click()
    expect(command).toHaveBeenCalledOnce()
    wrapper.unmount()
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
    expect(document.body.querySelector('.m-tiered-menu--teleported')).toBeTruthy()
    wrapper.unmount()
  })
})
