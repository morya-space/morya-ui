import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdButtonGroup from './ButtonGroup.vue'

describe('rdButtonGroup', () => {
  it('groups buttons and can stretch fluid', () => {
    const wrapper = mount(RdButtonGroup, {
      props: { fluid: true, ariaLabel: 'Align' },
      slots: {
        default: [
          '<button class="rd-button">Left</button>',
          '<button class="rd-button">Right</button>',
        ],
      },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['rd-button-group', 'rd-button-group--fluid']))
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Align')
    expect(wrapper.findAll('.rd-button')).toHaveLength(2)
  })
})
