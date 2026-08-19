import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdInputGroup from './InputGroup.vue'
import WdInputGroupAddon from './InputGroupAddon.vue'

describe('WdInputGroup', () => {
  it('renders addons and default slot content', () => {
    const wrapper = mount(WdInputGroup, {
      slots: {
        default: [
          '<span class="wd-inputgroup-addon">$</span>',
          '<input class="wd-input" />',
          '<span class="wd-inputgroup-addon">.00</span>',
        ].join(''),
      },
    })
    expect(wrapper.classes()).toContain('wd-inputgroup')
    expect(wrapper.findAll('.wd-inputgroup-addon')).toHaveLength(2)
  })
})

describe('WdInputGroupAddon', () => {
  it('applies addon class to slotted content', () => {
    const wrapper = mount(WdInputGroupAddon, { slots: { default: 'https://' } })
    expect(wrapper.classes()).toContain('wd-inputgroup-addon')
    expect(wrapper.text()).toBe('https://')
  })
})
