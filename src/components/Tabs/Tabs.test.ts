import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiTabs from './Tabs.vue'

const tabs = [{ label: 'Design', value: 'design' }, { label: 'Data', value: 'data' }, { label: 'Disabled', value: 'disabled', disabled: true }]

describe('WiTabs', () => {
  it('emits the selected tab value', async () => {
    const wrapper = mount(WiTabs, { props: { tabs, modelValue: 'design' } })
    const tab = wrapper.findAll('[role="tab"]')[1]
    expect(tab).toBeDefined()
    await tab!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['data']])
    expect(wrapper.emitted('change')).toEqual([['data']])
  })

  it('supports arrow-key navigation across enabled tabs', async () => {
    const wrapper = mount(WiTabs, { attachTo: document.body, props: { tabs, modelValue: 'design' } })
    await wrapper.get('[role="tab"]').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toEqual([['data']])
    wrapper.unmount()
  })

  it('closes a tab and adds a tab', async () => {
    const wrapper = mount(WiTabs, {
      props: {
        tabs: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
        modelValue: 'a',
        closable: true,
        addable: true,
      },
    })
    await wrapper.get('.wi-tabs__close').trigger('click')
    expect(wrapper.emitted('close')?.[0]).toEqual(['a'])
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b'])
    await wrapper.get('.wi-tabs__add').trigger('click')
    expect(wrapper.emitted('add')).toHaveLength(1)
  })

  it('applies the card type class', () => {
    const wrapper = mount(WiTabs, { props: { tabs, type: 'card', modelValue: 'design' } })
    expect(wrapper.classes()).toContain('wi-tabs--card')
  })
})
