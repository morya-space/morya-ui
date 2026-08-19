import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdTag from './Tag.vue'

describe('WdTag', () => {
  it('renders its value with selected visual props', () => {
    const wrapper = mount(WdTag, { props: { value: 'Published', severity: 'success', rounded: true } })
    expect(wrapper.text()).toBe('Published')
    expect(wrapper.classes()).toContain('wd-tag--success')
    expect(wrapper.classes()).toContain('wd-tag--rounded')
  })

  it('normalizes legacy warning severity to warn', () => {
    const wrapper = mount(WdTag, { props: { value: 'Caution', severity: 'warning' } })
    expect(wrapper.classes()).toContain('wd-tag--warn')
    expect(wrapper.classes()).not.toContain('wd-tag--warning')
  })

  it('renders WdIcon when icon is a string name', () => {
    const wrapper = mount(WdTag, { props: { value: 'Done', icon: 'check', severity: 'success' } })
    expect(wrapper.find('.wd-icon').exists()).toBe(true)
    expect(wrapper.text()).toContain('Done')
  })

  it('defaults severity to primary', () => {
    const wrapper = mount(WdTag, { props: { value: 'Default' } })
    expect(wrapper.classes()).toContain('wd-tag--primary')
  })
})
