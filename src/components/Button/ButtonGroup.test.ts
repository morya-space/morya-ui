import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MButton from './Button.vue'
import MButtonGroup from './ButtonGroup.vue'

describe('MButtonGroup', () => {
  it('groups buttons and can stretch block', () => {
    const wrapper = mount(MButtonGroup, {
      props: { block: true, ariaLabel: 'Align' },
      slots: {
        default: [
          '<button class="m-button">Left</button>',
          '<button class="m-button">Right</button>',
        ],
      },
    })
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Align')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['m-button-group', 'm-button-group--block']),
    )
  })

  it('renders nested MButton children', () => {
    const wrapper = mount(MButtonGroup, {
      slots: {
        default: {
          components: { MButton },
          template: `
            <MButton label="Left" />
            <MButton label="Right" type="primary" />
          `,
        },
      },
    })
    expect(wrapper.findAll('.m-button')).toHaveLength(2)
  })
})
