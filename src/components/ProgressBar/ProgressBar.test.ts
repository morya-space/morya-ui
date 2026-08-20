import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiProgressBar from './ProgressBar.vue'

describe('WiProgressBar', () => {
  it('renders determinate value and label by default', () => {
    const wrapper = mount(WiProgressBar, { props: { value: 42 } })
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-valuenow')).toBe('42')
    expect(wrapper.find('.wi-progressbar__label').text()).toBe('42%')
    expect(wrapper.find('.wi-progressbar__value').attributes('style')).toContain('width: 42%')
  })

  it('clamps value between 0 and 100', () => {
    const high = mount(WiProgressBar, { props: { value: 150 } })
    const low = mount(WiProgressBar, { props: { value: -10 } })
    expect(high.attributes('aria-valuenow')).toBe('100')
    expect(low.attributes('aria-valuenow')).toBe('0')
  })

  it('hides label when showValue is false', () => {
    const wrapper = mount(WiProgressBar, { props: { value: 50, showValue: false } })
    expect(wrapper.find('.wi-progressbar__label').exists()).toBe(false)
  })

  it('applies indeterminate mode without valuemax/now', () => {
    const wrapper = mount(WiProgressBar, { props: { mode: 'indeterminate' } })
    expect(wrapper.classes()).toContain('wi-progressbar--indeterminate')
    expect(wrapper.attributes('aria-valuenow')).toBeUndefined()
    expect(wrapper.find('.wi-progressbar__label').exists()).toBe(false)
  })
})
