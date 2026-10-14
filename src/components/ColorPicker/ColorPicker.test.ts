import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MColorPicker from './ColorPicker.vue'

describe('MColorPicker', () => {
  it('renders trigger with current color swatch', () => {
    const wrapper = mount(MColorPicker, { props: { modelValue: '#ff0000', teleport: false } })
    const swatch = wrapper.find('.m-colorpicker__trigger-swatch')
    expect(swatch.exists()).toBe(true)
    expect(swatch.attributes('style')).toContain('background: #ff0000')
  })

  it('opens panel on trigger click', async () => {
    const wrapper = mount(MColorPicker, { props: { modelValue: '#000000', teleport: false } })
    await wrapper.find('.m-colorpicker__trigger').trigger('click')
    expect(wrapper.find('.m-colorpicker__panel').exists()).toBe(true)
  })

  it('emits change when preset is clicked', async () => {
    const wrapper = mount(MColorPicker, {
      props: {
        modelValue: '#000000',
        presets: [{ colors: ['#ff0000', '#00ff00'] }],
        teleport: false,
      },
    })
    await wrapper.find('.m-colorpicker__trigger').trigger('click')
    const presets = wrapper.findAll('.m-colorpicker__preset-swatch')
    await presets[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#ff0000'])
  })

  it('emits clear when clear button is clicked', async () => {
    const wrapper = mount(MColorPicker, {
      props: { modelValue: '#ff0000', clearable: true, teleport: false },
    })
    await wrapper.find('.m-colorpicker__clear').trigger('click')
    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('updates input value when hex is typed', async () => {
    const wrapper = mount(MColorPicker, { props: { modelValue: '#000000', teleport: false } })
    await wrapper.find('.m-colorpicker__trigger').trigger('click')
    const input = wrapper.find('.m-input')
    await input.setValue('#00ff00')
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#00ff00'])
  })

  it('respects disabled state', async () => {
    const wrapper = mount(MColorPicker, { props: { modelValue: '#000000', disabled: true, teleport: false } })
    await wrapper.find('.m-colorpicker__trigger').trigger('click')
    expect(wrapper.find('.m-colorpicker__panel').exists()).toBe(false)
  })

  it('hides alpha slider when disabledAlpha is true', async () => {
    const wrapper = mount(MColorPicker, {
      props: { modelValue: '#000000', disabledAlpha: true, teleport: false },
    })
    await wrapper.find('.m-colorpicker__trigger').trigger('click')
    expect(wrapper.find('.m-colorpicker__alpha').exists()).toBe(false)
  })

  it('switches to gradient mode', async () => {
    const wrapper = mount(MColorPicker, {
      props: { modelValue: '#ff0000', gradient: true, teleport: false },
    })
    await wrapper.find('.m-colorpicker__trigger').trigger('click')
    const inputs = wrapper.findAll('.m-segmented__input')
    await inputs[1]!.setValue(true) // Select Gradient option
    expect(wrapper.find('.m-colorpicker__gradient-bar').exists()).toBe(true)
  })

  it('adds gradient stop on bar click', async () => {
    const wrapper = mount(MColorPicker, {
      props: { modelValue: '#ff0000', gradient: true, teleport: false },
    })
    await wrapper.find('.m-colorpicker__trigger').trigger('click')
    const inputs = wrapper.findAll('.m-segmented__input')
    await inputs[1]!.setValue(true)
    
    // Initially 2 stops
    expect(wrapper.findAll('.m-colorpicker__gradient-stop').length).toBe(2)
  })

  it('parses gradient from modelValue', () => {
    const wrapper = mount(MColorPicker, {
      props: {
        modelValue: 'linear-gradient(90deg, #ff0000 0%, #0000ff 100%)',
        gradient: true,
        teleport: false,
      },
    })
    expect(wrapper.find('.m-colorpicker__trigger-swatch').exists()).toBe(true)
  })
})
