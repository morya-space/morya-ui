import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiKnob from './Knob.vue'

describe('WiKnob', () => {
  it('renders value template and supports keyboard step', async () => {
    const wrapper = mount(WiKnob, {
      props: { modelValue: 40, min: 0, max: 100, step: 5, valueTemplate: '{value}%' },
    })
    expect(wrapper.find('.wi-knob__label').text()).toBe('40%')
    await wrapper.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([45])
  })

  it('clamps Home/End and respects disabled', async () => {
    const wrapper = mount(WiKnob, { props: { modelValue: 50, min: 10, max: 90, disabled: true } })
    await wrapper.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.classes()).toContain('wi-knob--disabled')
  })
})
