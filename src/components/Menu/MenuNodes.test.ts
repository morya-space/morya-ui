import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import WdMenu from './Menu.vue'

describe('MenuNodes', () => {
  it('activates leaf items and toggles nested groups', async () => {
    const wrapper = mount(WdMenu, {
      props: {
        model: [
          { key: 'file', label: 'File', items: [{ key: 'save', label: 'Save' }] },
          { key: 'quit', label: 'Quit' },
        ],
      },
    })

    await wrapper.get('.wd-menu__item--submenu .wd-menu__item-content').trigger('click')
    expect(wrapper.find('.wd-menu__submenu').exists()).toBe(true)
    await wrapper.get('.wd-menu__submenu .wd-menu__item-content').trigger('click')
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ label: 'Save' })
  })

  it('renders separator rows', () => {
    const wrapper = mount(WdMenu, {
      props: {
        model: [{ separator: true }, { label: 'Item' }],
      },
    })
    expect(wrapper.find('.wd-menu__separator').exists()).toBe(true)
  })

  it('renders RouterLink when item.to is set and router is available', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/home', component: { template: '<div />' } }],
    })
    await router.push('/')
    await router.isReady()

    const wrapper = mount(WdMenu, {
      global: { plugins: [router] },
      props: {
        model: [{ key: 'home', label: 'Home', to: '/home' }],
      },
    })
    expect(wrapper.find('a.wd-menu__item-content').exists()).toBe(true)
    expect(wrapper.get('a.wd-menu__item-content').attributes('href')).toContain('/home')
  })

  it('renders anchor fallback when item.to is set without router', () => {
    const wrapper = mount(WdMenu, {
      props: {
        model: [{ key: 'docs', label: 'Docs', to: '/docs' }],
      },
    })
    expect(wrapper.find('a.wd-menu__item-content').attributes('href')).toBe('/docs')
  })
})
