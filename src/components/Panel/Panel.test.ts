import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MPanel from './Panel.vue'

describe('muPanel', () => {
  it('renders header and content', () => {
    const wrapper = mount(MPanel, {
      props: { header: 'Overview' },
      slots: { default: '<p>Body</p>' },
    })
    expect(wrapper.get('.m-panel__header').text()).toContain('Overview')
    expect(wrapper.get('.m-panel__content').text()).toBe('Body')
    expect(wrapper.find('.m-panel__toggler').exists()).toBe(false)
  })

  it('toggles collapsed via modelValue and emits both events', async () => {
    const wrapper = mount(MPanel, {
      props: { header: 'Box', toggleable: true, modelValue: false },
      slots: { default: 'Inner' },
    })
    expect(wrapper.get('.m-panel__content').isVisible()).toBe(true)
    await wrapper.get('.m-panel__toggler').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.emitted('update:collapsed')).toEqual([[true]])
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.classes()).toContain('m-panel--collapsed')
    expect(wrapper.get('.m-panel__toggler').attributes('aria-expanded')).toBe('false')
  })

  it('renders footer and size', () => {
    const wrapper = mount(MPanel, {
      props: { header: 'Box', size: 'small' },
      slots: { default: 'Body', footer: 'Actions' },
    })
    expect(wrapper.classes()).toContain('m-panel--small')
    expect(wrapper.get('.m-panel__footer').text()).toBe('Actions')
  })

  it('toggles without v-model using defaultCollapsed', async () => {
    const wrapper = mount(MPanel, {
      props: { header: 'Box', toggleable: true, defaultCollapsed: true },
      slots: { default: 'Inner' },
    })
    expect(wrapper.classes()).toContain('m-panel--collapsed')
    expect(wrapper.get('.m-panel__toggler').attributes('aria-expanded')).toBe('false')
    await wrapper.get('.m-panel__toggler').trigger('click')
    expect(wrapper.get('.m-panel__content').isVisible()).toBe(true)
    expect(wrapper.emitted('update:collapsed')).toEqual([[false]])
  })
})
