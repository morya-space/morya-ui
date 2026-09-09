import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MButtonGroup from './ButtonGroup.vue'

describe('muButtonGroup', () => {
  it('groups buttons and can stretch fluid', () => {
    const wrapper = mount(MButtonGroup, {
      props: { fluid: true, ariaLabel: 'Align' },
      slots: {
        default: [
          '<button class="m-button">Left</button>',
          '<button class="m-button">Right</button>',
        ],
      },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['m-button-group', 'm-button-group--fluid']))
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Align')
    expect(wrapper.findAll('.m-button')).toHaveLength(2)
  })
})
