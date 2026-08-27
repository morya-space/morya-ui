import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiButtonGroup from './ButtonGroup.vue'

describe('wiButtonGroup', () => {
  it('groups buttons and can stretch fluid', () => {
    const wrapper = mount(WiButtonGroup, {
      props: { fluid: true, ariaLabel: 'Align' },
      slots: {
        default: [
          '<button class="wi-button">Left</button>',
          '<button class="wi-button">Right</button>',
        ],
      },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['wi-button-group', 'wi-button-group--fluid']))
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Align')
    expect(wrapper.findAll('.wi-button')).toHaveLength(2)
  })
})
