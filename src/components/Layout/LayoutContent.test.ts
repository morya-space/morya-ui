import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkLayoutContent from './LayoutContent.vue'

describe('LayoutContent', () => {
  it('renders main content region', () => {
    const wrapper = mount(WkLayoutContent, {
      slots: { default: 'Page body' },
    })
    expect(wrapper.classes()).toContain('wk-layout-content')
    expect(wrapper.text()).toBe('Page body')
  })

  it('applies padding and radius styles', () => {
    const wrapper = mount(WkLayoutContent, {
      props: { padding: 24, radius: 6 },
    })
    expect(wrapper.element.style.padding).toBe('24px')
    expect(wrapper.element.style.borderRadius).toBe('6px')
  })
})
