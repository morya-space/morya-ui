import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdTabs from './Tabs.vue'

const tabs = [{ label: 'Design', value: 'design' }, { label: 'Data', value: 'data' }, { label: 'Disabled', value: 'disabled', disabled: true }]

describe('WdTabs', () => {
  it('emits the selected tab value', async () => {
    const wrapper = mount(WdTabs, { props: { tabs, modelValue: 'design' } })
    const tab = wrapper.findAll('[role="tab"]')[1]
    expect(tab).toBeDefined()
    await tab!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['data']])
    expect(wrapper.emitted('change')).toEqual([['data']])
  })

  it('supports arrow-key navigation across enabled tabs', async () => {
    const wrapper = mount(WdTabs, { attachTo: document.body, props: { tabs, modelValue: 'design' } })
    await wrapper.get('[role="tab"]').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toEqual([['data']])
    wrapper.unmount()
  })
})
