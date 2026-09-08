import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WkAvatar from './Avatar.vue'
import WkAvatarGroup from './AvatarGroup.vue'

describe('wkAvatarGroup', () => {
  it('shows overflow rest when max is exceeded', () => {
    const wrapper = mount(WkAvatarGroup, {
      props: { max: 2 },
      slots: {
        default: () => [
          h(WkAvatar, { label: 'A' }),
          h(WkAvatar, { label: 'B' }),
          h(WkAvatar, { label: 'C' }),
        ],
      },
    })
    expect(wrapper.findAll('.wk-avatar')).toHaveLength(3)
    expect(wrapper.get('.wk-avatar-group__overflow').text()).toBe('+1')
  })
})
