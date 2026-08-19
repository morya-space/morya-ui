import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdDivider from './Divider.vue'

describe('WdDivider', () => {
  it('renders an accessible labeled separator', () => {
    const wrapper = mount(WdDivider, { props: { label: 'Advanced settings' } })
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal')
    expect(wrapper.text()).toContain('Advanced settings')
  })

  it('uses layout as preferred over orientation', () => {
    const wrapper = mount(WdDivider, {
      props: { layout: 'vertical', orientation: 'horizontal', label: 'Or' },
    })
    expect(wrapper.classes()).toContain('wd-divider--vertical')
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
  })

  it('falls back to orientation when layout is omitted', () => {
    const wrapper = mount(WdDivider, { props: { orientation: 'vertical' } })
    expect(wrapper.classes()).toContain('wd-divider--vertical')
  })

  it('applies type and horizontal align classes', () => {
    const wrapper = mount(WdDivider, {
      props: { label: 'Section', type: 'dashed', align: 'left' },
    })
    expect(wrapper.classes()).toContain('wd-divider--dashed')
    expect(wrapper.classes()).toContain('wd-divider--align-left')
  })
})
