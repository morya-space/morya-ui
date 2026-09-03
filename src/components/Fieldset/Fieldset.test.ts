import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiFieldset from './Fieldset.vue'

describe('wiFieldset', () => {
  it('renders legend and content', () => {
    const wrapper = mount(WiFieldset, {
      props: { legend: 'Details' },
      slots: { default: 'Fields' },
    })
    expect(wrapper.get('.wi-fieldset__legend').text()).toContain('Details')
    expect(wrapper.get('.wi-fieldset__content').text()).toBe('Fields')
  })

  it('emits update:collapsed when toggleable', async () => {
    const wrapper = mount(WiFieldset, {
      props: { legend: 'Box', toggleable: true, collapsed: false },
      slots: { default: 'Inner' },
    })
    await wrapper.get('.wi-fieldset__toggler').trigger('click')
    expect(wrapper.emitted('update:collapsed')).toEqual([[true]])
    await wrapper.setProps({ collapsed: true })
    expect(wrapper.classes()).toContain('wi-fieldset--collapsed')
    expect(wrapper.get('.wi-fieldset__toggler').attributes('aria-expanded')).toBe('false')
  })

  it('toggles without v-model using defaultCollapsed', async () => {
    const wrapper = mount(WiFieldset, {
      props: { legend: 'Box', toggleable: true, defaultCollapsed: true },
      slots: { default: 'Inner' },
    })
    expect(wrapper.classes()).toContain('wi-fieldset--collapsed')
    expect(wrapper.get('.wi-fieldset__toggler').attributes('aria-controls')).toBeTruthy()
    await wrapper.get('.wi-fieldset__toggler').trigger('click')
    expect(wrapper.get('.wi-fieldset__content').isVisible()).toBe(true)
    expect(wrapper.emitted('update:collapsed')).toEqual([[false]])
  })
})
