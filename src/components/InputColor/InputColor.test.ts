import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdInputColor from './InputColor.vue'

describe('WdInputColor', () => {
  it('emits hex from color input', async () => {
    const wrapper = mount(WdInputColor, { props: { modelValue: '#112233' } })
    const color = wrapper.find('.wd-inputcolor__swatch')
    await color.setValue('#abcdef')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#abcdef'])
  })

  it('emits text edits', async () => {
    const wrapper = mount(WdInputColor, { props: { modelValue: '#000000' } })
    await wrapper.find('.wd-inputcolor__text').setValue('#ff0000')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#ff0000'])
  })
})
