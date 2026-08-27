import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiBlockUI from './BlockUI.vue'

describe('wiBlockUI', () => {
  it('renders default slot without overlay when not blocked', () => {
    const wrapper = mount(WiBlockUI, { slots: { default: '<p>Content</p>' } })
    expect(wrapper.text()).toContain('Content')
    expect(wrapper.find('.wi-blockui__overlay').exists()).toBe(false)
  })

  it('shows overlay when blocked', () => {
    const wrapper = mount(WiBlockUI, {
      props: { blocked: true },
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.classes()).toContain('wi-blockui--blocked')
    expect(wrapper.find('.wi-blockui__overlay').exists()).toBe(true)
  })
})
