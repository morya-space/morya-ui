import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkPanel from './Panel.vue'

describe('wkPanel', () => {
  it('renders header and content', () => {
    const wrapper = mount(WkPanel, {
      props: { header: 'Overview' },
      slots: { default: '<p>Body</p>' },
    })
    expect(wrapper.get('.wk-panel__header').text()).toContain('Overview')
    expect(wrapper.get('.wk-panel__content').text()).toBe('Body')
    expect(wrapper.find('.wk-panel__toggler').exists()).toBe(false)
  })

  it('toggles collapsed via modelValue and emits both events', async () => {
    const wrapper = mount(WkPanel, {
      props: { header: 'Box', toggleable: true, modelValue: false },
      slots: { default: 'Inner' },
    })
    expect(wrapper.get('.wk-panel__content').isVisible()).toBe(true)
    await wrapper.get('.wk-panel__toggler').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.emitted('update:collapsed')).toEqual([[true]])
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.classes()).toContain('wk-panel--collapsed')
    expect(wrapper.get('.wk-panel__toggler').attributes('aria-expanded')).toBe('false')
  })

  it('renders footer and size', () => {
    const wrapper = mount(WkPanel, {
      props: { header: 'Box', size: 'small' },
      slots: { default: 'Body', footer: 'Actions' },
    })
    expect(wrapper.classes()).toContain('wk-panel--small')
    expect(wrapper.get('.wk-panel__footer').text()).toBe('Actions')
  })

  it('toggles without v-model using defaultCollapsed', async () => {
    const wrapper = mount(WkPanel, {
      props: { header: 'Box', toggleable: true, defaultCollapsed: true },
      slots: { default: 'Inner' },
    })
    expect(wrapper.classes()).toContain('wk-panel--collapsed')
    expect(wrapper.get('.wk-panel__toggler').attributes('aria-expanded')).toBe('false')
    await wrapper.get('.wk-panel__toggler').trigger('click')
    expect(wrapper.get('.wk-panel__content').isVisible()).toBe(true)
    expect(wrapper.emitted('update:collapsed')).toEqual([[false]])
  })
})
