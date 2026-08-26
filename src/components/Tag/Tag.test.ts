import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiTag from './Tag.vue'

describe('WiTag', () => {
  it('renders its value with selected visual props', () => {
    const wrapper = mount(WiTag, { props: { value: 'Published', severity: 'success', rounded: true } })
    expect(wrapper.text()).toBe('Published')
    expect(wrapper.classes()).toContain('wi-tag--success')
    expect(wrapper.classes()).toContain('wi-tag--rounded')
  })

  it('normalizes legacy warning severity to warn', () => {
    const wrapper = mount(WiTag, { props: { value: 'Caution', severity: 'warning' } })
    expect(wrapper.classes()).toContain('wi-tag--warn')
    expect(wrapper.classes()).not.toContain('wi-tag--warning')
  })

  it('renders WiIcon when icon is a string name', () => {
    const wrapper = mount(WiTag, { props: { value: 'Done', icon: 'check', severity: 'success' } })
    expect(wrapper.find('.wi-icon').exists()).toBe(true)
    expect(wrapper.text()).toContain('Done')
  })

  it('defaults severity to primary', () => {
    const wrapper = mount(WiTag, { props: { value: 'Default' } })
    expect(wrapper.classes()).toContain('wi-tag--primary')
  })

  it('emits close when closable', async () => {
    const wrapper = mount(WiTag, { props: { value: 'Draft', closable: true, bordered: true, size: 'small' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['wi-tag--closable', 'wi-tag--bordered', 'wi-tag--small']))
    await wrapper.get('.wi-tag__close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
