import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import WiSidebar from './Sidebar.vue'

describe('wiSidebar', () => {
  it('renders menu labels and runs command', async () => {
    const command = vi.fn()
    const wrapper = mount(WiSidebar, {
      props: { model: [{ label: 'Dashboard', icon: '▦', command }] },
    })
    expect(wrapper.text()).toContain('Dashboard')
    await wrapper.find('.wi-sidebar__link').trigger('click')
    expect(command).toHaveBeenCalled()
  })

  it('hides labels when collapsed', () => {
    const wrapper = mount(WiSidebar, {
      props: { collapsed: true, model: [{ label: 'Dashboard', icon: '▦' }] },
    })
    expect(wrapper.classes()).toContain('wi-sidebar--collapsed')
    expect(wrapper.find('.wi-sidebar__label').exists()).toBe(false)
  })
})
