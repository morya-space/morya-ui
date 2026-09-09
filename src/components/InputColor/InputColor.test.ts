import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MInputColor from './InputColor.vue'

describe('muInputColor', () => {
  it('emits hex from color input', async () => {
    const wrapper = mount(MInputColor, { props: { modelValue: '#112233' } })
    const color = wrapper.find('.m-inputcolor__swatch')
    await color.setValue('#abcdef')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#abcdef'])
  })

  it('emits text edits', async () => {
    const wrapper = mount(MInputColor, { props: { modelValue: '#000000' } })
    await wrapper.find('.m-inputcolor__text').setValue('#ff0000')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#ff0000'])
  })

  it('picks a swatch', async () => {
    const wrapper = mount(MInputColor, { props: { modelValue: '#000000', swatches: ['#ff0000', '#00ff00'] } })
    await wrapper.findAll('.m-inputcolor__preset')[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#ff0000'])
  })
})
