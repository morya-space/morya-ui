import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import WkSidebar from './Sidebar.vue'

describe('wkSidebar', () => {
  it('renders menu labels and runs command', async () => {
    const command = vi.fn()
    const wrapper = mount(WkSidebar, {
      props: { model: [{ label: 'Dashboard', icon: '▦', command }] },
    })
    expect(wrapper.text()).toContain('Dashboard')
    await wrapper.find('.wk-sidebar__link').trigger('click')
    expect(command).toHaveBeenCalled()
  })

  it('hides labels when collapsed', () => {
    const wrapper = mount(WkSidebar, {
      props: { collapsed: true, model: [{ label: 'Dashboard', icon: '▦' }] },
    })
    expect(wrapper.classes()).toContain('wk-sidebar--collapsed')
    expect(wrapper.find('.wk-sidebar__label').exists()).toBe(false)
  })
})
