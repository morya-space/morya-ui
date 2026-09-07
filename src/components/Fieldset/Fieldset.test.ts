import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdFieldset from './Fieldset.vue'

describe('rdFieldset', () => {
  it('renders legend and content', () => {
    const wrapper = mount(RdFieldset, {
      props: { legend: 'Details' },
      slots: { default: 'Fields' },
    })
    expect(wrapper.get('.rd-fieldset__legend').text()).toContain('Details')
    expect(wrapper.get('.rd-fieldset__content').text()).toBe('Fields')
  })

  it('emits update:collapsed when toggleable', async () => {
    const wrapper = mount(RdFieldset, {
      props: { legend: 'Box', toggleable: true, collapsed: false },
      slots: { default: 'Inner' },
    })
    await wrapper.get('.rd-fieldset__toggler').trigger('click')
    expect(wrapper.emitted('update:collapsed')).toEqual([[true]])
    await wrapper.setProps({ collapsed: true })
    expect(wrapper.classes()).toContain('rd-fieldset--collapsed')
    expect(wrapper.get('.rd-fieldset__toggler').attributes('aria-expanded')).toBe('false')
  })

  it('toggles without v-model using defaultCollapsed', async () => {
    const wrapper = mount(RdFieldset, {
      props: { legend: 'Box', toggleable: true, defaultCollapsed: true },
      slots: { default: 'Inner' },
    })
    expect(wrapper.classes()).toContain('rd-fieldset--collapsed')
    expect(wrapper.get('.rd-fieldset__toggler').attributes('aria-controls')).toBeTruthy()
    await wrapper.get('.rd-fieldset__toggler').trigger('click')
    expect(wrapper.get('.rd-fieldset__content').isVisible()).toBe(true)
    expect(wrapper.emitted('update:collapsed')).toEqual([[false]])
  })
})
