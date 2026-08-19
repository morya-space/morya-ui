import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdAccordion from './Accordion.vue'

const tabs = [
  { value: 'one', header: 'One' },
  { value: 'two', header: 'Two' },
  { value: 'off', header: 'Disabled', disabled: true },
]

describe('WdAccordion', () => {
  it('expands a single tab and collapses on second click', async () => {
    const wrapper = mount(WdAccordion, {
      props: { tabs, modelValue: '' },
      slots: { one: '<p>Panel one</p>', two: '<p>Panel two</p>' },
    })
    const headers = wrapper.findAll('.wd-accordion__header')
    await headers[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['one']])
    await wrapper.setProps({ modelValue: 'one' })
    expect(wrapper.get('#wd-accordion-panel-one').isVisible()).toBe(true)
    expect(headers[0]!.attributes('aria-expanded')).toBe('true')
    await headers[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
  })

  it('supports multiple open panels', async () => {
    const wrapper = mount(WdAccordion, {
      props: { tabs, multiple: true, modelValue: ['one'] },
      slots: { one: '<p>One</p>', two: '<p>Two</p>' },
    })
    const headers = wrapper.findAll('.wd-accordion__header')
    await headers[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['one', 'two']])
    await headers[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.length).toBe(1)
  })
})
