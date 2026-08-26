import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiPanel from './Panel.vue'

describe('WiPanel', () => {
  it('renders header and content', () => {
    const wrapper = mount(WiPanel, {
      props: { header: 'Overview' },
      slots: { default: '<p>Body</p>' },
    })
    expect(wrapper.get('.wi-panel__header').text()).toContain('Overview')
    expect(wrapper.get('.wi-panel__content').text()).toBe('Body')
    expect(wrapper.find('.wi-panel__toggler').exists()).toBe(false)
  })

  it('toggles collapsed via modelValue and emits both events', async () => {
    const wrapper = mount(WiPanel, {
      props: { header: 'Box', toggleable: true, modelValue: false },
      slots: { default: 'Inner' },
    })
    expect(wrapper.get('.wi-panel__content').isVisible()).toBe(true)
    await wrapper.get('.wi-panel__toggler').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.emitted('update:collapsed')).toEqual([[true]])
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.get('.wi-panel__content').attributes('style')).toContain('display: none')
  })

  it('renders footer and size', () => {
    const wrapper = mount(WiPanel, {
      props: { header: 'Box', size: 'small' },
      slots: { default: 'Body', footer: 'Actions' },
    })
    expect(wrapper.classes()).toContain('wi-panel--small')
    expect(wrapper.get('.wi-panel__footer').text()).toBe('Actions')
  })
})
