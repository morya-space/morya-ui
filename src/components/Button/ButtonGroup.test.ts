import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdButtonGroup from './ButtonGroup.vue'

describe('wdButtonGroup', () => {
  it('groups buttons and can stretch fluid', () => {
    const wrapper = mount(WdButtonGroup, {
      props: { fluid: true, ariaLabel: 'Align' },
      slots: {
        default: [
          '<button class="wd-button">Left</button>',
          '<button class="wd-button">Right</button>',
        ],
      },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['wd-button-group', 'wd-button-group--fluid']))
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Align')
    expect(wrapper.findAll('.wd-button')).toHaveLength(2)
  })
})
