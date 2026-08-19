import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdBlockUI from './BlockUI.vue'

describe('WdBlockUI', () => {
  it('renders default slot without overlay when not blocked', () => {
    const wrapper = mount(WdBlockUI, { slots: { default: '<p>Content</p>' } })
    expect(wrapper.text()).toContain('Content')
    expect(wrapper.find('.wd-blockui__overlay').exists()).toBe(false)
  })

  it('shows overlay when blocked', () => {
    const wrapper = mount(WdBlockUI, {
      props: { blocked: true },
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.classes()).toContain('wd-blockui--blocked')
    expect(wrapper.find('.wd-blockui__overlay').exists()).toBe(true)
  })
})
