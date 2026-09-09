import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import MAvatar from './Avatar.vue'
import MAvatarGroup from './AvatarGroup.vue'

describe('muAvatarGroup', () => {
  it('shows overflow rest when max is exceeded', () => {
    const wrapper = mount(MAvatarGroup, {
      props: { max: 2 },
      slots: {
        default: () => [
          h(MAvatar, { label: 'A' }),
          h(MAvatar, { label: 'B' }),
          h(MAvatar, { label: 'C' }),
        ],
      },
    })
    expect(wrapper.findAll('.m-avatar')).toHaveLength(3)
    expect(wrapper.get('.m-avatar-group__overflow').text()).toBe('+1')
  })
})
