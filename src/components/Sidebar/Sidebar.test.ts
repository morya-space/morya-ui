import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import WdSidebar from './Sidebar.vue'

describe('WdSidebar', () => {
  it('renders menu labels and runs command', async () => {
    const command = vi.fn()
    const wrapper = mount(WdSidebar, {
      props: { model: [{ label: 'Dashboard', icon: '▦', command }] },
    })
    expect(wrapper.text()).toContain('Dashboard')
    await wrapper.find('.wd-sidebar__link').trigger('click')
    expect(command).toHaveBeenCalled()
  })

  it('hides labels when collapsed', () => {
    const wrapper = mount(WdSidebar, {
      props: { collapsed: true, model: [{ label: 'Dashboard', icon: '▦' }] },
    })
    expect(wrapper.classes()).toContain('wd-sidebar--collapsed')
    expect(wrapper.find('.wd-sidebar__label').exists()).toBe(false)
  })
})
