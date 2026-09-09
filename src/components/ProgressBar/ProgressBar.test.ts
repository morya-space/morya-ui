import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MProgressBar from './ProgressBar.vue'

describe('muProgressBar', () => {
  it('renders determinate value and label by default', () => {
    const wrapper = mount(MProgressBar, { props: { value: 42 } })
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-valuenow')).toBe('42')
    expect(wrapper.find('.m-progressbar__label').text()).toBe('42%')
    expect(wrapper.find('.m-progressbar__value').attributes('style')).toContain('width: 42%')
  })

  it('clamps value between 0 and 100', () => {
    const high = mount(MProgressBar, { props: { value: 150 } })
    const low = mount(MProgressBar, { props: { value: -10 } })
    expect(high.attributes('aria-valuenow')).toBe('100')
    expect(low.attributes('aria-valuenow')).toBe('0')
  })

  it('hides label when showValue is false', () => {
    const wrapper = mount(MProgressBar, { props: { value: 50, showValue: false } })
    expect(wrapper.find('.m-progressbar__label').exists()).toBe(false)
  })

  it('applies indeterminate mode without valuemax/now', () => {
    const wrapper = mount(MProgressBar, { props: { mode: 'indeterminate' } })
    expect(wrapper.classes()).toContain('m-progressbar--indeterminate')
    expect(wrapper.attributes('aria-valuenow')).toBeUndefined()
    expect(wrapper.find('.m-progressbar__label').exists()).toBe(false)
  })

  it('renders circle type and status tone', () => {
    const wrapper = mount(MProgressBar, { props: { value: 40, type: 'circle', status: 'success' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['m-progressbar--circle', 'm-progressbar--success']))
    expect(wrapper.find('.m-progressbar__circle').exists()).toBe(true)
    expect(wrapper.get('.m-progressbar__circle-label').text()).toBe('40%')
  })
})
