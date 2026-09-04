import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdBreadcrumb from './Breadcrumb.vue'

describe('wdBreadcrumb', () => {
  it('renders home and model items with separators', () => {
    const wrapper = mount(WdBreadcrumb, {
      props: {
        home: { label: 'Home', to: '/' },
        model: [
          { label: 'Products', to: '/products' },
          { label: 'Shoes', disabled: true },
          { label: 'Detail' },
        ],
      },
    })
    expect(wrapper.findAll('.wd-breadcrumb__item')).toHaveLength(4)
    expect(wrapper.findAll('.wd-breadcrumb__separator')).toHaveLength(3)
    expect(wrapper.get('a[href="/"]').text()).toBe('Home')
    expect(wrapper.get('a[href="/products"]').text()).toBe('Products')
    expect(wrapper.find('.wd-breadcrumb__link--disabled').text()).toBe('Shoes')
    expect(wrapper.find('[aria-current="page"]').text()).toBe('Detail')
  })

  it('renders span when to is missing', () => {
    const wrapper = mount(WdBreadcrumb, {
      props: { model: [{ label: 'Only' }] },
    })
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.get('.wd-breadcrumb__link').text()).toBe('Only')
  })

  it('uses a custom separator', () => {
    const wrapper = mount(WdBreadcrumb, {
      props: { model: [{ label: 'A', to: '/a' }, { label: 'B' }], separator: '>' },
    })
    expect(wrapper.get('.wd-breadcrumb__separator').text()).toBe('>')
  })

  it('uses locale home label by default', () => {
    const wrapper = mount(WdBreadcrumb, {
      props: {
        home: { to: '/' },
        model: [{ label: 'Detail' }],
      },
    })
    expect(wrapper.get('a[href="/"]').text()).toBe('首页')
  })

  it('supports item slot override', () => {
    const wrapper = mount(WdBreadcrumb, {
      props: { model: [{ label: 'A', to: '/a' }, { label: 'B' }] },
      slots: {
        item: ({ item, active }: { item: { label: string }; active: boolean }) =>
          `[${item.label}${active ? '*' : ''}]`,
      },
    })
    expect(wrapper.text()).toContain('[A]')
    expect(wrapper.text()).toContain('[B*]')
  })
})
