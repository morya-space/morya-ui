import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdPanel from './Panel.vue'

describe('WdPanel', () => {
  it('renders header and content', () => {
    const wrapper = mount(WdPanel, {
      props: { header: 'Overview' },
      slots: { default: '<p>Body</p>' },
    })
    expect(wrapper.get('.wd-panel__header').text()).toContain('Overview')
    expect(wrapper.get('.wd-panel__content').text()).toBe('Body')
    expect(wrapper.find('.wd-panel__toggler').exists()).toBe(false)
  })

  it('toggles collapsed via modelValue and emits both events', async () => {
    const wrapper = mount(WdPanel, {
      props: { header: 'Box', toggleable: true, modelValue: false },
      slots: { default: 'Inner' },
    })
    expect(wrapper.get('.wd-panel__content').isVisible()).toBe(true)
    await wrapper.get('.wd-panel__toggler').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.emitted('update:collapsed')).toEqual([[true]])
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.get('.wd-panel__content').attributes('style')).toContain('display: none')
  })
})
