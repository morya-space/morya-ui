import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import RdAvatar from './Avatar.vue'
import RdAvatarGroup from './AvatarGroup.vue'

describe('rdAvatarGroup', () => {
  it('shows overflow rest when max is exceeded', () => {
    const wrapper = mount(RdAvatarGroup, {
      props: { max: 2 },
      slots: {
        default: () => [
          h(RdAvatar, { label: 'A' }),
          h(RdAvatar, { label: 'B' }),
          h(RdAvatar, { label: 'C' }),
        ],
      },
    })
    expect(wrapper.findAll('.rd-avatar')).toHaveLength(3)
    expect(wrapper.get('.rd-avatar-group__overflow').text()).toBe('+1')
  })
})
