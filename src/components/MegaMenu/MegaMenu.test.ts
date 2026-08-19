import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WdMegaMenu from './MegaMenu.vue'

describe('WdMegaMenu', () => {
  it('opens column panel and runs child command', async () => {
    const command = vi.fn()
    const wrapper = mount(WdMegaMenu, {
      props: {
        model: [
          {
            label: 'Products',
            items: [[{ label: 'UI Kit', command }], [{ label: 'Icons' }]],
          },
        ],
        teleport: false,
      },
    })
    await wrapper.find('.wd-megamenu__trigger').trigger('click')
    expect(wrapper.find('.wd-megamenu__panel').exists()).toBe(true)
    expect(wrapper.findAll('.wd-megamenu__column')).toHaveLength(2)
    await wrapper.findAll('.wd-megamenu__link')[0]!.trigger('click')
    expect(command).toHaveBeenCalled()
  })

  it('teleports panel to body by default', async () => {
    const wrapper = mount(WdMegaMenu, {
      props: {
        model: [
          {
            label: 'Products',
            items: [[{ label: 'UI Kit' }]],
          },
        ],
      },
      attachTo: document.body,
    })
    await wrapper.find('.wd-megamenu__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.wd-megamenu__panel--teleported')).toBeTruthy()
    wrapper.unmount()
  })
})
