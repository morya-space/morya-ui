import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MSlider from './Slider.vue'

describe('muSlider', () => {
  it('emits single value updates', async () => {
    const wrapper = mount(MSlider, { props: { modelValue: 20, min: 0, max: 100 } })
    const input = wrapper.get('input')
    await input.setValue('45')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([45])
  })

  it('supports range mode with two thumbs', async () => {
    const wrapper = mount(MSlider, {
      props: { range: true, modelValue: [10, 80], min: 0, max: 100 },
    })
    const inputs = wrapper.findAll('input')
    expect(inputs).toHaveLength(2)
    await inputs[0]!.setValue('25')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[25, 80]])
  })

  it('marks disabled state', () => {
    const wrapper = mount(MSlider, { props: { disabled: true } })
    expect(wrapper.get('.m-slider').classes()).toContain('m-slider--disabled')
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
  })

  it('renders marks and vertical layout', () => {
    const wrapper = mount(MSlider, {
      props: { modelValue: 20, marks: { 0: 'Low', 100: 'High' }, tooltip: true, vertical: true },
    })
    expect(wrapper.get('.m-slider').classes()).toEqual(
      expect.arrayContaining(['m-slider--vertical', 'm-slider--tooltip']),
    )
    expect(wrapper.text()).toContain('Low')
    expect(wrapper.text()).toContain('High')
  })
})
