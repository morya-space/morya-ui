import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdInputGroup from './InputGroup.vue'
import RdInputGroupAddon from './InputGroupAddon.vue'

describe('rdInputGroup', () => {
  it('renders addons and default slot content', () => {
    const wrapper = mount(RdInputGroup, {
      slots: {
        default: [
          '<span class="rd-inputgroup-addon">$</span>',
          '<input class="rd-input" />',
          '<span class="rd-inputgroup-addon">.00</span>',
        ].join(''),
      },
    })
    expect(wrapper.classes()).toContain('rd-inputgroup')
    expect(wrapper.findAll('.rd-inputgroup-addon')).toHaveLength(2)
  })
})

describe('rdInputGroupAddon', () => {
  it('applies addon class to slotted content', () => {
    const wrapper = mount(RdInputGroupAddon, { slots: { default: 'https://' } })
    expect(wrapper.classes()).toContain('rd-inputgroup-addon')
    expect(wrapper.text()).toBe('https://')
  })
})
