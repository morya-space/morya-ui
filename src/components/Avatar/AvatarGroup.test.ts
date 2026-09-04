import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WdAvatar from './Avatar.vue'
import WdAvatarGroup from './AvatarGroup.vue'

describe('wdAvatarGroup', () => {
  it('shows overflow rest when max is exceeded', () => {
    const wrapper = mount(WdAvatarGroup, {
      props: { max: 2 },
      slots: {
        default: () => [
          h(WdAvatar, { label: 'A' }),
          h(WdAvatar, { label: 'B' }),
          h(WdAvatar, { label: 'C' }),
        ],
      },
    })
    expect(wrapper.findAll('.wd-avatar')).toHaveLength(3)
    expect(wrapper.get('.wd-avatar-group__overflow').text()).toBe('+1')
  })
})
