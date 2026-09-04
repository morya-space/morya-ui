import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdDivider from './Divider.vue'

describe('wdDivider', () => {
  it('renders an accessible labeled separator', () => {
    const wrapper = mount(WdDivider, { props: { label: 'Advanced settings' } })
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal')
    expect(wrapper.text()).toContain('Advanced settings')
  })

  it('uses layout for orientation', () => {
    const wrapper = mount(WdDivider, {
      props: { layout: 'vertical', label: 'Or' },
    })
    expect(wrapper.classes()).toContain('wd-divider--vertical')
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
  })

  it('defaults to horizontal layout', () => {
    const wrapper = mount(WdDivider, { props: { label: 'Section' } })
    expect(wrapper.classes()).toContain('wd-divider--horizontal')
  })

  it('applies type and horizontal align classes', () => {
    const wrapper = mount(WdDivider, {
      props: { label: 'Section', type: 'dashed', align: 'left' },
    })
    expect(wrapper.classes()).toContain('wd-divider--dashed')
    expect(wrapper.classes()).toContain('wd-divider--align-left')
  })

  it('uses titlePlacement as an alias of align', () => {
    const wrapper = mount(WdDivider, { props: { label: 'Or', titlePlacement: 'right' } })
    expect(wrapper.classes()).toContain('wd-divider--align-right')
  })
})
