import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MLayoutContent from './LayoutContent.vue'

describe('layoutContent', () => {
  it('renders main content region as a single element', () => {
    const wrapper = mount(MLayoutContent, {
      slots: { default: 'Page body' },
    })
    expect(wrapper.classes()).toContain('m-layout-content')
    expect(wrapper.find('.m-layout__scroll').exists()).toBe(false)
    expect(wrapper.find('.m-layout__scrollbar').exists()).toBe(false)
    expect(wrapper.text()).toBe('Page body')
  })

  it('does not apply default padding', () => {
    const wrapper = mount(MLayoutContent)
    expect(wrapper.element.style.padding).toBe('')
  })

  it('applies padding and radius styles when set', () => {
    const wrapper = mount(MLayoutContent, {
      props: { padding: 24, radius: 6 },
    })
    expect(wrapper.element.style.padding).toBe('24px')
    expect(wrapper.element.style.borderRadius).toBe('6px')
  })
})
