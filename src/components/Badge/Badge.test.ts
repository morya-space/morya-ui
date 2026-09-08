import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkBadge from './Badge.vue'

describe('wkBadge', () => {
  it('renders value with severity and size classes', () => {
    const wrapper = mount(WkBadge, { props: { value: 3, severity: 'success', size: 'large' } })
    expect(wrapper.text()).toBe('3')
    expect(wrapper.classes()).toContain('wk-badge--success')
    expect(wrapper.classes()).toContain('wk-badge--large')
    expect(wrapper.classes()).not.toContain('wk-badge--dot')
  })

  it('renders as a dot when value is omitted', () => {
    const wrapper = mount(WkBadge, { props: { severity: 'danger' } })
    expect(wrapper.classes()).toContain('wk-badge--dot')
    expect(wrapper.text()).toBe('')
  })

  it('normalizes legacy warning severity to warn', () => {
    const wrapper = mount(WkBadge, { props: { value: '!', severity: 'warning' } })
    expect(wrapper.classes()).toContain('wk-badge--warn')
    expect(wrapper.classes()).not.toContain('wk-badge--warning')
  })

  it('maps sm size alias to small', () => {
    const wrapper = mount(WkBadge, { props: { value: 1, size: 'sm' } })
    expect(wrapper.classes()).toContain('wk-badge--small')
  })

  it('wraps content and caps value with max', () => {
    const wrapper = mount(WkBadge, {
      props: { value: 120, max: 99, processing: true },
      slots: { default: '<button>Inbox</button>' },
    })
    expect(wrapper.classes()).toContain('wk-badge-wrap')
    expect(wrapper.get('.wk-badge').text()).toBe('99+')
    expect(wrapper.get('.wk-badge').classes()).toContain('wk-badge--processing')
    expect(wrapper.get('button').text()).toBe('Inbox')
  })
})
