import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import MMenu from './Menu.vue'

describe('menuNodes', () => {
  it('activates leaf items and toggles nested groups', async () => {
    const wrapper = mount(MMenu, {
      props: {
        model: [
          { key: 'file', label: 'File', items: [{ key: 'save', label: 'Save' }] },
          { key: 'quit', label: 'Quit' },
        ],
      },
    })

    await wrapper.get('.m-menu__item--submenu .m-menu__item-content').trigger('click')
    expect(wrapper.find('.m-menu__submenu').exists()).toBe(true)
    await wrapper.get('.m-menu__submenu .m-menu__item-content').trigger('click')
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ label: 'Save' })
  })

  it('renders separator rows', () => {
    const wrapper = mount(MMenu, {
      props: {
        model: [{ separator: true }, { label: 'Item' }],
      },
    })
    expect(wrapper.find('.m-menu__separator').exists()).toBe(true)
  })

  it('renders RouterLink when item.to is set and router is available', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/home', component: { template: '<div />' } },
      ],
    })
    await router.push('/')
    await router.isReady()

    const wrapper = mount(MMenu, {
      global: { plugins: [router] },
      props: {
        model: [{ key: 'home', label: 'Home', to: '/home' }],
      },
    })
    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.exists()).toBe(true)
    expect(link.props('to')).toBe('/home')
  })

  it('renders anchor fallback when item.to is set without router', () => {
    const wrapper = mount(MMenu, {
      props: {
        model: [{ key: 'docs', label: 'Docs', to: '/docs' }],
      },
    })
    expect(wrapper.findComponent({ name: 'RouterLink' }).exists()).toBe(false)
    expect(wrapper.find('a.m-menu__item-content').attributes('href')).toBe('/docs')
  })

  it('renders built-in icon when icon is a valid IconName', () => {
    const wrapper = mount(MMenu, {
      props: {
        model: [{ key: 'settings', label: 'Settings', icon: 'settings' }],
      },
    })
    expect(wrapper.find('.m-menu__icon').exists()).toBe(true)
    expect(wrapper.find('.m-icon').exists()).toBe(true)
  })

  it('renders custom component icon when icon is a component', () => {
    const CustomIcon = defineComponent({
      name: 'CustomIcon',
      setup() {
        return () => h('svg', { class: 'custom-icon' }, [h('path', { d: 'M0 0h24v24H0z' })])
      },
    })

    const wrapper = mount(MMenu, {
      props: {
        model: [{ key: 'custom', label: 'Custom', icon: CustomIcon }],
      },
    })

    expect(wrapper.find('.m-menu__icon').exists()).toBe(true)
    expect(wrapper.findComponent(CustomIcon).exists()).toBe(true)
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
  })

  it('renders custom component icon for nested menu items', () => {
    const CustomIcon = defineComponent({
      name: 'CustomIcon',
      setup() {
        return () => h('svg', { class: 'custom-icon' })
      },
    })

    const wrapper = mount(MMenu, {
      props: {
        model: [
          {
            key: 'parent',
            label: 'Parent',
            icon: 'settings',
            items: [{ key: 'child', label: 'Child', icon: CustomIcon }],
          },
        ],
        defaultExpandedKeys: ['parent'],
      },
    })

    const icons = wrapper.findAll('.m-menu__icon')
    expect(icons).toHaveLength(2)
    expect(wrapper.findComponent(CustomIcon).exists()).toBe(true)
  })
})
