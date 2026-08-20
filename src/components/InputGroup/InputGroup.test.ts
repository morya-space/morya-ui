import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiInputGroup from './InputGroup.vue'
import WiInputGroupAddon from './InputGroupAddon.vue'

describe('WiInputGroup', () => {
  it('renders addons and default slot content', () => {
    const wrapper = mount(WiInputGroup, {
      slots: {
        default: [
          '<span class="wi-inputgroup-addon">$</span>',
          '<input class="wi-input" />',
          '<span class="wi-inputgroup-addon">.00</span>',
        ].join(''),
      },
    })
    expect(wrapper.classes()).toContain('wi-inputgroup')
    expect(wrapper.findAll('.wi-inputgroup-addon')).toHaveLength(2)
  })
})

describe('WiInputGroupAddon', () => {
  it('applies addon class to slotted content', () => {
    const wrapper = mount(WiInputGroupAddon, { slots: { default: 'https://' } })
    expect(wrapper.classes()).toContain('wi-inputgroup-addon')
    expect(wrapper.text()).toBe('https://')
  })
})
