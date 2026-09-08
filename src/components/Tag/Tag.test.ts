import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkTag from './Tag.vue'

describe('wkTag', () => {
  it('renders its value with selected visual props', () => {
    const wrapper = mount(WkTag, { props: { value: 'Published', severity: 'success', rounded: true } })
    expect(wrapper.text()).toBe('Published')
    expect(wrapper.classes()).toContain('wk-tag--success')
    expect(wrapper.classes()).toContain('wk-tag--rounded')
  })

  it('normalizes legacy warning severity to warn', () => {
    const wrapper = mount(WkTag, { props: { value: 'Caution', severity: 'warning' } })
    expect(wrapper.classes()).toContain('wk-tag--warn')
    expect(wrapper.classes()).not.toContain('wk-tag--warning')
  })

  it('renders WkIcon when icon is a string name', () => {
    const wrapper = mount(WkTag, { props: { value: 'Done', icon: 'check', severity: 'success' } })
    expect(wrapper.find('.wk-icon').exists()).toBe(true)
    expect(wrapper.text()).toContain('Done')
  })

  it('defaults severity to primary', () => {
    const wrapper = mount(WkTag, { props: { value: 'Default' } })
    expect(wrapper.classes()).toContain('wk-tag--primary')
  })

  it('emits close when closable', async () => {
    const wrapper = mount(WkTag, { props: { value: 'Draft', closable: true, bordered: true, size: 'small' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['wk-tag--closable', 'wk-tag--bordered', 'wk-tag--small']))
    await wrapper.get('.wk-tag__close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
