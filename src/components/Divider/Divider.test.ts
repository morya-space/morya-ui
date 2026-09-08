import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkDivider from './Divider.vue'

describe('wkDivider', () => {
  it('renders an accessible labeled separator', () => {
    const wrapper = mount(WkDivider, { props: { label: 'Advanced settings' } })
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal')
    expect(wrapper.text()).toContain('Advanced settings')
  })

  it('uses layout for orientation', () => {
    const wrapper = mount(WkDivider, {
      props: { layout: 'vertical', label: 'Or' },
    })
    expect(wrapper.classes()).toContain('wk-divider--vertical')
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
  })

  it('defaults to horizontal layout', () => {
    const wrapper = mount(WkDivider, { props: { label: 'Section' } })
    expect(wrapper.classes()).toContain('wk-divider--horizontal')
  })

  it('applies type and horizontal align classes', () => {
    const wrapper = mount(WkDivider, {
      props: { label: 'Section', type: 'dashed', align: 'left' },
    })
    expect(wrapper.classes()).toContain('wk-divider--dashed')
    expect(wrapper.classes()).toContain('wk-divider--align-left')
  })

  it('uses titlePlacement as an alias of align', () => {
    const wrapper = mount(WkDivider, { props: { label: 'Or', titlePlacement: 'right' } })
    expect(wrapper.classes()).toContain('wk-divider--align-right')
  })
})
