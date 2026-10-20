import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MProgressBar from './ProgressBar.vue'

describe('muProgressBar', () => {
  it('renders determinate value and label by default', () => {
    const wrapper = mount(MProgressBar, { props: { value: 42 } })
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-valuenow')).toBe('42')
    expect(wrapper.find('.m-progress-bar__label').text()).toBe('42%')
    expect(wrapper.find('.m-progress-bar__value').attributes('style')).toContain('--m-progress-bar-scale: 0.42')
    expect(wrapper.find('.m-progress-bar__fill').exists()).toBe(true)
  })

  it('clamps value between 0 and 100', () => {
    const high = mount(MProgressBar, { props: { value: 150 } })
    const low = mount(MProgressBar, { props: { value: -10 } })
    expect(high.attributes('aria-valuenow')).toBe('100')
    expect(low.attributes('aria-valuenow')).toBe('0')
  })

  it('hides label when showValue is false', () => {
    const wrapper = mount(MProgressBar, { props: { value: 50, showValue: false } })
    expect(wrapper.find('.m-progress-bar__label').exists()).toBe(false)
  })

  it('applies indeterminate mode without valuemax/now', () => {
    const wrapper = mount(MProgressBar, { props: { mode: 'indeterminate' } })
    expect(wrapper.classes()).toContain('m-progress-bar--indeterminate')
    expect(wrapper.attributes('aria-valuenow')).toBeUndefined()
    expect(wrapper.find('.m-progress-bar__label').exists()).toBe(false)
  })

  it('renders circle type and status tone', () => {
    const wrapper = mount(MProgressBar, { props: { value: 40, type: 'circle', status: 'success' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['m-progress-bar--circle', 'm-progress-bar--success']))
    expect(wrapper.find('.m-progress-bar__circle').exists()).toBe(true)
    expect(wrapper.get('.m-progress-bar__circle-label').text()).toBe('40%')
  })

  it('maps exception to danger and active to stripe class', () => {
    const exception = mount(MProgressBar, { props: { value: 70, status: 'exception' } })
    expect(exception.classes()).toContain('m-progress-bar--danger')

    const active = mount(MProgressBar, { props: { value: 50, status: 'active' } })
    expect(active.classes()).toContain('m-progress-bar--active')
    expect(active.classes()).not.toContain('m-progress-bar--indeterminate')
  })
})
