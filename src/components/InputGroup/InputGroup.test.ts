import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkInputGroup from './InputGroup.vue'
import WkInputGroupAddon from './InputGroupAddon.vue'

describe('wkInputGroup', () => {
  it('renders addons and default slot content', () => {
    const wrapper = mount(WkInputGroup, {
      slots: {
        default: [
          '<span class="wk-inputgroup-addon">$</span>',
          '<input class="wk-input" />',
          '<span class="wk-inputgroup-addon">.00</span>',
        ].join(''),
      },
    })
    expect(wrapper.classes()).toContain('wk-inputgroup')
    expect(wrapper.findAll('.wk-inputgroup-addon')).toHaveLength(2)
  })
})

describe('wkInputGroupAddon', () => {
  it('applies addon class to slotted content', () => {
    const wrapper = mount(WkInputGroupAddon, { slots: { default: 'https://' } })
    expect(wrapper.classes()).toContain('wk-inputgroup-addon')
    expect(wrapper.text()).toBe('https://')
  })
})
