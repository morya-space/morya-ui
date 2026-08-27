import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiDivider from './Divider.vue'

describe('wiDivider', () => {
  it('renders an accessible labeled separator', () => {
    const wrapper = mount(WiDivider, { props: { label: 'Advanced settings' } })
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal')
    expect(wrapper.text()).toContain('Advanced settings')
  })

  it('uses layout as preferred over orientation', () => {
    const wrapper = mount(WiDivider, {
      props: { layout: 'vertical', orientation: 'horizontal', label: 'Or' },
    })
    expect(wrapper.classes()).toContain('wi-divider--vertical')
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
  })

  it('falls back to orientation when layout is omitted', () => {
    const wrapper = mount(WiDivider, { props: { orientation: 'vertical' } })
    expect(wrapper.classes()).toContain('wi-divider--vertical')
  })

  it('applies type and horizontal align classes', () => {
    const wrapper = mount(WiDivider, {
      props: { label: 'Section', type: 'dashed', align: 'left' },
    })
    expect(wrapper.classes()).toContain('wi-divider--dashed')
    expect(wrapper.classes()).toContain('wi-divider--align-left')
  })

  it('uses titlePlacement as an alias of align', () => {
    const wrapper = mount(WiDivider, { props: { label: 'Or', titlePlacement: 'right' } })
    expect(wrapper.classes()).toContain('wi-divider--align-right')
  })
})
