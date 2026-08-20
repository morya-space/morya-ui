import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiMeterGroup from './MeterGroup.vue'

describe('WiMeterGroup', () => {
  it('renders segments and legend', () => {
    const wrapper = mount(WiMeterGroup, {
      props: {
        value: [
          { label: 'Apps', value: 40, color: '#2563eb' },
          { label: 'Messages', value: 20, color: '#16a34a' },
        ],
        max: 100,
      },
    })
    expect(wrapper.findAll('.wi-metergroup__segment')).toHaveLength(2)
    expect(wrapper.text()).toContain('Apps')
    expect(wrapper.find('.wi-metergroup__segment').attributes('style')).toContain('40%')
  })
})
