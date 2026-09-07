import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdLayoutHeader from './LayoutHeader.vue'

describe('LayoutHeader', () => {
  it('renders slot content with bordered modifier by default', () => {
    const wrapper = mount(RdLayoutHeader, {
      slots: { default: 'Top bar' },
    })
    expect(wrapper.text()).toBe('Top bar')
    expect(wrapper.classes()).toContain('rd-layout-header--bordered')
  })

  it('applies dimension props to the root element', () => {
    const wrapper = mount(RdLayoutHeader, {
      props: { height: 56, padding: 12, bordered: false },
    })
    expect(wrapper.element.style.height).toBe('56px')
    expect(wrapper.element.style.padding).toBe('12px')
    expect(wrapper.classes()).not.toContain('rd-layout-header--bordered')
  })
})
