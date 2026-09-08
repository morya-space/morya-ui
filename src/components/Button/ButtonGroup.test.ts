import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkButtonGroup from './ButtonGroup.vue'

describe('wkButtonGroup', () => {
  it('groups buttons and can stretch fluid', () => {
    const wrapper = mount(WkButtonGroup, {
      props: { fluid: true, ariaLabel: 'Align' },
      slots: {
        default: [
          '<button class="wk-button">Left</button>',
          '<button class="wk-button">Right</button>',
        ],
      },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['wk-button-group', 'wk-button-group--fluid']))
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Align')
    expect(wrapper.findAll('.wk-button')).toHaveLength(2)
  })
})
