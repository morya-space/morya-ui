import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdBadge from './Badge.vue'

describe('rdBadge', () => {
  it('renders value with severity and size classes', () => {
    const wrapper = mount(RdBadge, { props: { value: 3, severity: 'success', size: 'large' } })
    expect(wrapper.text()).toBe('3')
    expect(wrapper.classes()).toContain('rd-badge--success')
    expect(wrapper.classes()).toContain('rd-badge--large')
    expect(wrapper.classes()).not.toContain('rd-badge--dot')
  })

  it('renders as a dot when value is omitted', () => {
    const wrapper = mount(RdBadge, { props: { severity: 'danger' } })
    expect(wrapper.classes()).toContain('rd-badge--dot')
    expect(wrapper.text()).toBe('')
  })

  it('normalizes legacy warning severity to warn', () => {
    const wrapper = mount(RdBadge, { props: { value: '!', severity: 'warning' } })
    expect(wrapper.classes()).toContain('rd-badge--warn')
    expect(wrapper.classes()).not.toContain('rd-badge--warning')
  })

  it('maps sm size alias to small', () => {
    const wrapper = mount(RdBadge, { props: { value: 1, size: 'sm' } })
    expect(wrapper.classes()).toContain('rd-badge--small')
  })

  it('wraps content and caps value with max', () => {
    const wrapper = mount(RdBadge, {
      props: { value: 120, max: 99, processing: true },
      slots: { default: '<button>Inbox</button>' },
    })
    expect(wrapper.classes()).toContain('rd-badge-wrap')
    expect(wrapper.get('.rd-badge').text()).toBe('99+')
    expect(wrapper.get('.rd-badge').classes()).toContain('rd-badge--processing')
    expect(wrapper.get('button').text()).toBe('Inbox')
  })
})
