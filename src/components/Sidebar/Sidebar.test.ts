import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import RdSidebar from './Sidebar.vue'

describe('rdSidebar', () => {
  it('renders menu labels and runs command', async () => {
    const command = vi.fn()
    const wrapper = mount(RdSidebar, {
      props: { model: [{ label: 'Dashboard', icon: '▦', command }] },
    })
    expect(wrapper.text()).toContain('Dashboard')
    await wrapper.find('.rd-sidebar__link').trigger('click')
    expect(command).toHaveBeenCalled()
  })

  it('hides labels when collapsed', () => {
    const wrapper = mount(RdSidebar, {
      props: { collapsed: true, model: [{ label: 'Dashboard', icon: '▦' }] },
    })
    expect(wrapper.classes()).toContain('rd-sidebar--collapsed')
    expect(wrapper.find('.rd-sidebar__label').exists()).toBe(false)
  })
})
