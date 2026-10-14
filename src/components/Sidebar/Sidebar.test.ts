import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
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

  it('renders custom component icon for items', () => {
    const CustomIcon = defineComponent({
      name: 'CustomIcon',
      setup() {
        return () => h('svg', { class: 'custom-icon' })
      },
    })

    const wrapper = mount(MSidebar, {
      props: { model: [{ label: 'Custom', icon: CustomIcon }] },
    })

    expect(wrapper.find('.m-sidebar__icon').exists()).toBe(true)
    expect(wrapper.findComponent(CustomIcon).exists()).toBe(true)
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
  })
})
