import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiBadge from './Badge.vue'

describe('WiBadge', () => {
  it('renders value with severity and size classes', () => {
    const wrapper = mount(WiBadge, { props: { value: 3, severity: 'success', size: 'large' } })
    expect(wrapper.text()).toBe('3')
    expect(wrapper.classes()).toContain('wi-badge--success')
    expect(wrapper.classes()).toContain('wi-badge--large')
    expect(wrapper.classes()).not.toContain('wi-badge--dot')
  })

  it('renders as a dot when value is omitted', () => {
    const wrapper = mount(WiBadge, { props: { severity: 'danger' } })
    expect(wrapper.classes()).toContain('wi-badge--dot')
    expect(wrapper.text()).toBe('')
  })

  it('normalizes legacy warning severity to warn', () => {
    const wrapper = mount(WiBadge, { props: { value: '!', severity: 'warning' } })
    expect(wrapper.classes()).toContain('wi-badge--warn')
    expect(wrapper.classes()).not.toContain('wi-badge--warning')
  })

  it('maps sm size alias to small', () => {
    const wrapper = mount(WiBadge, { props: { value: 1, size: 'sm' } })
    expect(wrapper.classes()).toContain('wi-badge--small')
  })

  it('wraps content and caps value with max', () => {
    const wrapper = mount(WiBadge, {
      props: { value: 120, max: 99, processing: true },
      slots: { default: '<button>Inbox</button>' },
    })
    expect(wrapper.classes()).toContain('wi-badge-wrap')
    expect(wrapper.get('.wi-badge').text()).toBe('99+')
    expect(wrapper.get('.wi-badge').classes()).toContain('wi-badge--processing')
    expect(wrapper.get('button').text()).toBe('Inbox')
  })
})
