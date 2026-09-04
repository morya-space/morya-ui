import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdLayoutContent from './LayoutContent.vue'

describe('LayoutContent', () => {
  it('renders main content region', () => {
    const wrapper = mount(WdLayoutContent, {
      slots: { default: 'Page body' },
    })
    expect(wrapper.classes()).toContain('wd-layout-content')
    expect(wrapper.text()).toBe('Page body')
  })

  it('applies padding and radius styles', () => {
    const wrapper = mount(WdLayoutContent, {
      props: { padding: 24, radius: 6 },
    })
    expect(wrapper.element.style.padding).toBe('24px')
    expect(wrapper.element.style.borderRadius).toBe('6px')
  })
})
