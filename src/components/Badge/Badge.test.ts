import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdBadge from './Badge.vue'

describe('WdBadge', () => {
  it('renders value with severity and size classes', () => {
    const wrapper = mount(WdBadge, { props: { value: 3, severity: 'success', size: 'large' } })
    expect(wrapper.text()).toBe('3')
    expect(wrapper.classes()).toContain('wd-badge--success')
    expect(wrapper.classes()).toContain('wd-badge--large')
    expect(wrapper.classes()).not.toContain('wd-badge--dot')
  })

  it('renders as a dot when value is omitted', () => {
    const wrapper = mount(WdBadge, { props: { severity: 'danger' } })
    expect(wrapper.classes()).toContain('wd-badge--dot')
    expect(wrapper.text()).toBe('')
  })

  it('normalizes legacy warning severity to warn', () => {
    const wrapper = mount(WdBadge, { props: { value: '!', severity: 'warning' } })
    expect(wrapper.classes()).toContain('wd-badge--warn')
    expect(wrapper.classes()).not.toContain('wd-badge--warning')
  })

  it('maps sm size alias to small', () => {
    const wrapper = mount(WdBadge, { props: { value: 1, size: 'sm' } })
    expect(wrapper.classes()).toContain('wd-badge--small')
  })
})
