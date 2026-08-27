import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WiAvatar from './Avatar.vue'
import WiAvatarGroup from './AvatarGroup.vue'

describe('wiAvatarGroup', () => {
  it('shows overflow rest when max is exceeded', () => {
    const wrapper = mount(WiAvatarGroup, {
      props: { max: 2 },
      slots: {
        default: () => [
          h(WiAvatar, { label: 'A' }),
          h(WiAvatar, { label: 'B' }),
          h(WiAvatar, { label: 'C' }),
        ],
      },
    })
    expect(wrapper.findAll('.wi-avatar')).toHaveLength(3)
    expect(wrapper.get('.wi-avatar-group__overflow').text()).toBe('+1')
  })
})
