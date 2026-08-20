import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiListbox from './Listbox.vue'

const options = [
  { label: 'Apple', value: 'a' },
  { label: 'Banana', value: 'b' },
  { label: 'Cherry', value: 'c', disabled: true },
]

describe('WiListbox', () => {
  it('emits single selection', async () => {
    const wrapper = mount(WiListbox, { props: { options, modelValue: 'a' } })
    await wrapper.findAll('.wi-listbox__option')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['b']])
  })

  it('supports multiple and filter', async () => {
    const wrapper = mount(WiListbox, {
      props: { options, multiple: true, filter: true, modelValue: ['a'] },
    })
    await wrapper.find('.wi-listbox__filter').setValue('ban')
    expect(wrapper.findAll('.wi-listbox__option')).toHaveLength(1)
    await wrapper.find('.wi-listbox__option').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'b']])
    await wrapper.findAll('.wi-listbox__option')[0]
  })

  it('ignores disabled options', async () => {
    const wrapper = mount(WiListbox, { props: { options, modelValue: 'a' } })
    await wrapper.findAll('.wi-listbox__option')[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
