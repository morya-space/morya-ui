import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import MSidebar from './Sidebar.vue'

describe('muSidebar', () => {
  it('renders menu labels and runs command', async () => {
    const command = vi.fn()
    const wrapper = mount(MSidebar, {
      props: { model: [{ label: 'Dashboard', icon: '▦', command }] },
    })
    expect(wrapper.text()).toContain('Dashboard')
    await wrapper.find('.m-sidebar__link').trigger('click')
    expect(command).toHaveBeenCalled()
  })

  it('hides labels when collapsed', () => {
    const wrapper = mount(MSidebar, {
      props: { collapsed: true, model: [{ label: 'Dashboard', icon: '▦' }] },
    })
    expect(wrapper.classes()).toContain('m-sidebar--collapsed')
    expect(wrapper.find('.m-sidebar__label').exists()).toBe(false)
  })
})
