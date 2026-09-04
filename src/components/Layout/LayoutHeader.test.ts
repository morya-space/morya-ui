import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdLayoutHeader from './LayoutHeader.vue'

describe('LayoutHeader', () => {
  it('renders slot content with bordered modifier by default', () => {
    const wrapper = mount(WdLayoutHeader, {
      slots: { default: 'Top bar' },
    })
    expect(wrapper.text()).toBe('Top bar')
    expect(wrapper.classes()).toContain('wd-layout-header--bordered')
  })

  it('applies dimension props to the root element', () => {
    const wrapper = mount(WdLayoutHeader, {
      props: { height: 56, padding: 12, bordered: false },
    })
    expect(wrapper.element.style.height).toBe('56px')
    expect(wrapper.element.style.padding).toBe('12px')
    expect(wrapper.classes()).not.toContain('wd-layout-header--bordered')
  })
})
