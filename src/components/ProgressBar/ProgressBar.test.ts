import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdProgressBar from './ProgressBar.vue'

describe('rdProgressBar', () => {
  it('renders determinate value and label by default', () => {
    const wrapper = mount(RdProgressBar, { props: { value: 42 } })
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-valuenow')).toBe('42')
    expect(wrapper.find('.rd-progressbar__label').text()).toBe('42%')
    expect(wrapper.find('.rd-progressbar__value').attributes('style')).toContain('width: 42%')
  })

  it('clamps value between 0 and 100', () => {
    const high = mount(RdProgressBar, { props: { value: 150 } })
    const low = mount(RdProgressBar, { props: { value: -10 } })
    expect(high.attributes('aria-valuenow')).toBe('100')
    expect(low.attributes('aria-valuenow')).toBe('0')
  })

  it('hides label when showValue is false', () => {
    const wrapper = mount(RdProgressBar, { props: { value: 50, showValue: false } })
    expect(wrapper.find('.rd-progressbar__label').exists()).toBe(false)
  })

  it('applies indeterminate mode without valuemax/now', () => {
    const wrapper = mount(RdProgressBar, { props: { mode: 'indeterminate' } })
    expect(wrapper.classes()).toContain('rd-progressbar--indeterminate')
    expect(wrapper.attributes('aria-valuenow')).toBeUndefined()
    expect(wrapper.find('.rd-progressbar__label').exists()).toBe(false)
  })

  it('renders circle type and status tone', () => {
    const wrapper = mount(RdProgressBar, { props: { value: 40, type: 'circle', status: 'success' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['rd-progressbar--circle', 'rd-progressbar--success']))
    expect(wrapper.find('.rd-progressbar__circle').exists()).toBe(true)
    expect(wrapper.get('.rd-progressbar__circle-label').text()).toBe('40%')
  })
})
