import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiInputColor from './InputColor.vue'

describe('wiInputColor', () => {
  it('emits hex from color input', async () => {
    const wrapper = mount(WiInputColor, { props: { modelValue: '#112233' } })
    const color = wrapper.find('.wi-inputcolor__swatch')
    await color.setValue('#abcdef')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#abcdef'])
  })

  it('emits text edits', async () => {
    const wrapper = mount(WiInputColor, { props: { modelValue: '#000000' } })
    await wrapper.find('.wi-inputcolor__text').setValue('#ff0000')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#ff0000'])
  })

  it('picks a swatch', async () => {
    const wrapper = mount(WiInputColor, { props: { modelValue: '#000000', swatches: ['#ff0000', '#00ff00'] } })
    await wrapper.findAll('.wi-inputcolor__preset')[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#ff0000'])
  })
})
