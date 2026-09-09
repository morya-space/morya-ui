import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MBadge from './Badge.vue'

describe('muBadge', () => {
  it('renders value with severity and size classes', () => {
    const wrapper = mount(MBadge, { props: { value: 3, severity: 'success', size: 'large' } })
    expect(wrapper.text()).toBe('3')
    expect(wrapper.classes()).toContain('m-badge--success')
    expect(wrapper.classes()).toContain('m-badge--large')
    expect(wrapper.classes()).not.toContain('m-badge--dot')
  })

  it('renders as a dot when value is omitted', () => {
    const wrapper = mount(MBadge, { props: { severity: 'danger' } })
    expect(wrapper.classes()).toContain('m-badge--dot')
    expect(wrapper.text()).toBe('')
  })

  it('normalizes legacy warning severity to warn', () => {
    const wrapper = mount(MBadge, { props: { value: '!', severity: 'warning' } })
    expect(wrapper.classes()).toContain('m-badge--warn')
    expect(wrapper.classes()).not.toContain('m-badge--warning')
  })

  it('maps sm size alias to small', () => {
    const wrapper = mount(MBadge, { props: { value: 1, size: 'sm' } })
    expect(wrapper.classes()).toContain('m-badge--small')
  })

  it('wraps content and caps value with max', () => {
    const wrapper = mount(MBadge, {
      props: { value: 120, max: 99, processing: true },
      slots: { default: '<button>Inbox</button>' },
    })
    expect(wrapper.classes()).toContain('m-badge-wrap')
    expect(wrapper.get('.m-badge').text()).toBe('99+')
    expect(wrapper.get('.m-badge').classes()).toContain('m-badge--processing')
    expect(wrapper.get('button').text()).toBe('Inbox')
  })
})
