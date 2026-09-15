import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MStatus from './Status.vue'

describe('MStatus', () => {
  it('renders label with severity and size classes', () => {
    const wrapper = mount(MStatus, {
      props: { label: 'Online', severity: 'success', size: 'large' },
    })
    expect(wrapper.text()).toBe('Online')
    expect(wrapper.classes()).toContain('m-status--success')
    expect(wrapper.classes()).toContain('m-status--large')
    expect(wrapper.find('.m-status__dot').exists()).toBe(true)
    expect(wrapper.attributes('role')).toBe('status')
  })

  it('defaults severity to secondary', () => {
    const wrapper = mount(MStatus, { props: { label: 'Idle' } })
    expect(wrapper.classes()).toContain('m-status--secondary')
  })

  it('normalizes legacy warning severity to warn', () => {
    const wrapper = mount(MStatus, { props: { label: 'Caution', severity: 'warning' } })
    expect(wrapper.classes()).toContain('m-status--warn')
    expect(wrapper.classes()).not.toContain('m-status--warning')
  })

  it('renders slot content over label prop', () => {
    const wrapper = mount(MStatus, {
      props: { label: 'Ignored' },
      slots: { default: 'From slot' },
    })
    expect(wrapper.text()).toBe('From slot')
  })

  it('supports processing and custom color', () => {
    const wrapper = mount(MStatus, {
      props: { label: 'Syncing', processing: true, color: '#0ea5e9' },
    })
    expect(wrapper.classes()).toContain('m-status--processing')
    expect(wrapper.classes()).toContain('m-status--custom')
    expect(wrapper.attributes('style')).toContain('--m-status-color')
  })
})
