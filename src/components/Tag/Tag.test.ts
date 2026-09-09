import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MTag from './Tag.vue'

describe('muTag', () => {
  it('renders its value with selected visual props', () => {
    const wrapper = mount(MTag, { props: { value: 'Published', severity: 'success', rounded: true } })
    expect(wrapper.text()).toBe('Published')
    expect(wrapper.classes()).toContain('m-tag--success')
    expect(wrapper.classes()).toContain('m-tag--rounded')
  })

  it('normalizes legacy warning severity to warn', () => {
    const wrapper = mount(MTag, { props: { value: 'Caution', severity: 'warning' } })
    expect(wrapper.classes()).toContain('m-tag--warn')
    expect(wrapper.classes()).not.toContain('m-tag--warning')
  })

  it('renders MIcon when icon is a string name', () => {
    const wrapper = mount(MTag, { props: { value: 'Done', icon: 'check', severity: 'success' } })
    expect(wrapper.find('.m-icon').exists()).toBe(true)
    expect(wrapper.text()).toContain('Done')
  })

  it('defaults severity to primary', () => {
    const wrapper = mount(MTag, { props: { value: 'Default' } })
    expect(wrapper.classes()).toContain('m-tag--primary')
  })

  it('emits close when closable', async () => {
    const wrapper = mount(MTag, { props: { value: 'Draft', closable: true, bordered: true, size: 'small' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['m-tag--closable', 'm-tag--bordered', 'm-tag--small']))
    await wrapper.get('.m-tag__close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
