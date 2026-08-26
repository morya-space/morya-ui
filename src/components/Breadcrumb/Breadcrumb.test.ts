import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiBreadcrumb from './Breadcrumb.vue'

describe('WiBreadcrumb', () => {
  it('renders home and model items with separators', () => {
    const wrapper = mount(WiBreadcrumb, {
      props: {
        home: { label: 'Home', to: '/' },
        model: [
          { label: 'Products', to: '/products' },
          { label: 'Shoes', disabled: true },
          { label: 'Detail' },
        ],
      },
    })
    expect(wrapper.findAll('.wi-breadcrumb__item')).toHaveLength(4)
    expect(wrapper.findAll('.wi-breadcrumb__separator')).toHaveLength(3)
    expect(wrapper.get('a[href="/"]').text()).toBe('Home')
    expect(wrapper.get('a[href="/products"]').text()).toBe('Products')
    expect(wrapper.find('.wi-breadcrumb__link--disabled').text()).toBe('Shoes')
    expect(wrapper.find('[aria-current="page"]').text()).toBe('Detail')
  })

  it('renders span when to is missing', () => {
    const wrapper = mount(WiBreadcrumb, {
      props: { model: [{ label: 'Only' }] },
    })
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.get('.wi-breadcrumb__link').text()).toBe('Only')
  })

  it('uses a custom separator', () => {
    const wrapper = mount(WiBreadcrumb, {
      props: { model: [{ label: 'A', to: '/a' }, { label: 'B' }], separator: '>' },
    })
    expect(wrapper.get('.wi-breadcrumb__separator').text()).toBe('>')
  })
})
