import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkInputTags from './InputTags.vue'

describe('wkInputTags', () => {
  it('adds a tag on Enter', async () => {
    const wrapper = mount(WkInputTags, { props: { modelValue: [] } })
    const input = wrapper.find('.wk-inputtags__input')
    await input.setValue('vue')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['vue']])
  })

  it('removes a tag', async () => {
    const wrapper = mount(WkInputTags, { props: { modelValue: ['a', 'b'] } })
    await wrapper.findAll('.wk-inputtags__remove')[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['b']])
  })

  it('splits on separator and respects max', async () => {
    const wrapper = mount(WkInputTags, { props: { modelValue: ['a'], max: 2, separator: ',' } })
    const input = wrapper.find('.wk-inputtags__input')
    await input.setValue('b,c')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'b']])
    expect((wrapper.get('input').element as HTMLInputElement).disabled).toBe(false)
  })
})
