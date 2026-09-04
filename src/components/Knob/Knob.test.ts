import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdKnob from './Knob.vue'

describe('wdKnob', () => {
  it('renders value template and supports keyboard step', async () => {
    const wrapper = mount(WdKnob, {
      props: { modelValue: 40, min: 0, max: 100, step: 5, valueTemplate: '{value}%' },
    })
    expect(wrapper.find('.wd-knob__label').text()).toBe('40%')
    await wrapper.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([45])
  })

  it('clamps Home/End and respects disabled', async () => {
    const wrapper = mount(WdKnob, { props: { modelValue: 50, min: 10, max: 90, disabled: true } })
    await wrapper.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.classes()).toContain('wd-knob--disabled')
  })

  it('exposes aria label and value text', () => {
    const wrapper = mount(WdKnob, {
      props: { modelValue: 40, valueTemplate: '{value}%', ariaLabel: '音量' },
    })
    const slider = wrapper.get('[role="slider"]')
    expect(slider.attributes('aria-label')).toBe('音量')
    expect(slider.attributes('aria-valuetext')).toBe('40%')
    expect(slider.attributes('aria-valuenow')).toBe('40')
  })

  it('clamps with ArrowDown at max boundary', async () => {
    const wrapper = mount(WdKnob, { props: { modelValue: 90, min: 0, max: 90, step: 5 } })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([85])
    await wrapper.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([90])
  })

  it('steps down with ArrowDown', async () => {
    const wrapper = mount(WdKnob, { props: { modelValue: 40, step: 10 } })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([30])
  })

  it('supports diameter prop over the deprecated size alias', () => {
    const wrapper = mount(WdKnob, { props: { modelValue: 0, diameter: 160 } })
    const svg = wrapper.get('svg')
    expect(svg.attributes('width')).toBe('160')
    expect(svg.attributes('viewBox')).toBe('0 0 160 160')
  })
})
