import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ContextMenuNodes from './ContextMenuNodes.vue'

describe('ContextMenuNodes', () => {
  it('emits activate for leaf items', async () => {
    const wrapper = mount(ContextMenuNodes, {
      props: { items: [{ label: 'Copy' }, { label: 'Paste' }] },
    })
    await wrapper.findAll('.wi-contextmenu__item')[1]!.trigger('click')
    expect(wrapper.emitted('activate')?.[0]?.[0]).toMatchObject({ label: 'Paste' })
  })

  it('shows nested submenu on hover', async () => {
    const wrapper = mount(ContextMenuNodes, {
      props: {
        items: [{ label: 'Share', items: [{ label: 'Email' }] }],
      },
    })
    await wrapper.get('.wi-contextmenu__submenu-wrap').trigger('mouseenter')
    expect(wrapper.find('.wi-contextmenu__submenu').exists()).toBe(true)
  })
})
