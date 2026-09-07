import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdTag from './Tag.vue'

describe('rdTag', () => {
  it('renders its value with selected visual props', () => {
    const wrapper = mount(RdTag, { props: { value: 'Published', severity: 'success', rounded: true } })
    expect(wrapper.text()).toBe('Published')
    expect(wrapper.classes()).toContain('rd-tag--success')
    expect(wrapper.classes()).toContain('rd-tag--rounded')
  })

  it('normalizes legacy warning severity to warn', () => {
    const wrapper = mount(RdTag, { props: { value: 'Caution', severity: 'warning' } })
    expect(wrapper.classes()).toContain('rd-tag--warn')
    expect(wrapper.classes()).not.toContain('rd-tag--warning')
  })

  it('renders RdIcon when icon is a string name', () => {
    const wrapper = mount(RdTag, { props: { value: 'Done', icon: 'check', severity: 'success' } })
    expect(wrapper.find('.rd-icon').exists()).toBe(true)
    expect(wrapper.text()).toContain('Done')
  })

  it('defaults severity to primary', () => {
    const wrapper = mount(RdTag, { props: { value: 'Default' } })
    expect(wrapper.classes()).toContain('rd-tag--primary')
  })

  it('emits close when closable', async () => {
    const wrapper = mount(RdTag, { props: { value: 'Draft', closable: true, bordered: true, size: 'small' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['rd-tag--closable', 'rd-tag--bordered', 'rd-tag--small']))
    await wrapper.get('.rd-tag__close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
