import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdFieldset from './Fieldset.vue'

describe('WdFieldset', () => {
  it('renders legend and content', () => {
    const wrapper = mount(WdFieldset, {
      props: { legend: 'Details' },
      slots: { default: 'Fields' },
    })
    expect(wrapper.get('.wd-fieldset__legend').text()).toContain('Details')
    expect(wrapper.get('.wd-fieldset__content').text()).toBe('Fields')
  })

  it('emits update:collapsed when toggleable', async () => {
    const wrapper = mount(WdFieldset, {
      props: { legend: 'Box', toggleable: true, collapsed: false },
      slots: { default: 'Inner' },
    })
    await wrapper.get('.wd-fieldset__toggler').trigger('click')
    expect(wrapper.emitted('update:collapsed')).toEqual([[true]])
    await wrapper.setProps({ collapsed: true })
    expect(wrapper.get('.wd-fieldset__content').attributes('style')).toContain('display: none')
  })
})
