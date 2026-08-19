import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdSlider from './Slider.vue'

describe('WdSlider', () => {
  it('emits single value updates', async () => {
    const wrapper = mount(WdSlider, { props: { modelValue: 20, min: 0, max: 100 } })
    const input = wrapper.get('input')
    await input.setValue('45')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([45])
  })

  it('supports range mode with two thumbs', async () => {
    const wrapper = mount(WdSlider, {
      props: { range: true, modelValue: [10, 80], min: 0, max: 100 },
    })
    const inputs = wrapper.findAll('input')
    expect(inputs).toHaveLength(2)
    await inputs[0]!.setValue('25')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[25, 80]])
  })

  it('marks disabled state', () => {
    const wrapper = mount(WdSlider, { props: { disabled: true } })
    expect(wrapper.classes()).toContain('wd-slider--disabled')
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
  })
})
