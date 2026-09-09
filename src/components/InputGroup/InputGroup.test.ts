import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MInputGroup from './InputGroup.vue'
import MInputGroupAddon from './InputGroupAddon.vue'

describe('muInputGroup', () => {
  it('renders addons and default slot content', () => {
    const wrapper = mount(MInputGroup, {
      slots: {
        default: [
          '<span class="m-inputgroup-addon">$</span>',
          '<input class="m-input" />',
          '<span class="m-inputgroup-addon">.00</span>',
        ].join(''),
      },
    })
    expect(wrapper.classes()).toContain('m-inputgroup')
    expect(wrapper.findAll('.m-inputgroup-addon')).toHaveLength(2)
  })
})

describe('muInputGroupAddon', () => {
  it('applies addon class to slotted content', () => {
    const wrapper = mount(MInputGroupAddon, { slots: { default: 'https://' } })
    expect(wrapper.classes()).toContain('m-inputgroup-addon')
    expect(wrapper.text()).toBe('https://')
  })
})
