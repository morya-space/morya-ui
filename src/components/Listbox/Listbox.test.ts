import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdListbox from './Listbox.vue'

const options = [
  { label: 'Apple', value: 'a' },
  { label: 'Banana', value: 'b' },
  { label: 'Cherry', value: 'c', disabled: true },
]

describe('wdListbox', () => {
  it('emits single selection', async () => {
    const wrapper = mount(WdListbox, { props: { options, modelValue: 'a' } })
    await wrapper.findAll('.wd-listbox__option')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['b']])
  })

  it('supports multiple and filter', async () => {
    const wrapper = mount(WdListbox, {
      props: { options, multiple: true, filter: true, modelValue: ['a'] },
    })
    await wrapper.find('.wd-listbox__filter').setValue('ban')
    expect(wrapper.findAll('.wd-listbox__option')).toHaveLength(1)
    await wrapper.find('.wd-listbox__option').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'b']])
    await wrapper.findAll('.wd-listbox__option')[0]
  })

  it('ignores disabled options', async () => {
    const wrapper = mount(WdListbox, { props: { options, modelValue: 'a' } })
    await wrapper.findAll('.wd-listbox__option')[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('supports roving tabindex and keyboard selection', async () => {
    const wrapper = mount(WdListbox, {
      props: { options, modelValue: 'a' },
      attachTo: document.body,
    })
    const options_ = () => wrapper.findAll('.wd-listbox__option')
    // selected option is the single tab stop
    expect(options_()[0]!.attributes('tabindex')).toBe('0')
    expect(options_()[1]!.attributes('tabindex')).toBe('-1')

    const list = wrapper.get('.wd-listbox__list')
    expect(list.attributes('aria-label')).toBeTruthy()

    // tab into the list: focus lands on the selected option
    options_()[0]!.element.focus()
    await options_()[0]!.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(options_()[1]!.element)
    expect(options_()[1]!.attributes('tabindex')).toBe('0')

    await list.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b'])

    await list.trigger('keydown', { key: 'End' })
    expect(document.activeElement).toBe(options_()[1]!.element)
    await list.trigger('keydown', { key: 'Home' })
    expect(document.activeElement).toBe(options_()[0]!.element)
    wrapper.unmount()
  })
})
