import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdMeterGroup from './MeterGroup.vue'

describe('wdMeterGroup', () => {
  it('renders segments and legend', () => {
    const wrapper = mount(WdMeterGroup, {
      props: {
        value: [
          { label: 'Apps', value: 40, color: '#2563eb' },
          { label: 'Messages', value: 20, color: '#16a34a' },
        ],
        max: 100,
      },
    })
    expect(wrapper.findAll('.wd-metergroup__segment')).toHaveLength(2)
    expect(wrapper.text()).toContain('Apps')
    expect(wrapper.find('.wd-metergroup__segment').attributes('style')).toContain('40%')
  })

  it('exposes aria-valuenow on the meter', () => {
    const wrapper = mount(WdMeterGroup, {
      props: {
        value: [
          { label: 'Apps', value: 40, color: '#2563eb' },
          { label: 'Messages', value: 20, color: '#16a34a' },
        ],
        max: 100,
      },
    })
    expect(wrapper.get('[role="meter"]').attributes('aria-valuenow')).toBe('60')
  })
})
