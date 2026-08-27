import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiInputTags from './InputTags.vue'

describe('wiInputTags', () => {
  it('adds a tag on Enter', async () => {
    const wrapper = mount(WiInputTags, { props: { modelValue: [] } })
    const input = wrapper.find('.wi-inputtags__input')
    await input.setValue('vue')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['vue']])
  })

  it('removes a tag', async () => {
    const wrapper = mount(WiInputTags, { props: { modelValue: ['a', 'b'] } })
    await wrapper.findAll('.wi-inputtags__remove')[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['b']])
  })

  it('splits on separator and respects max', async () => {
    const wrapper = mount(WiInputTags, { props: { modelValue: ['a'], max: 2, separator: ',' } })
    const input = wrapper.find('.wi-inputtags__input')
    await input.setValue('b,c')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'b']])
    expect((wrapper.get('input').element as HTMLInputElement).disabled).toBe(false)
  })
})
