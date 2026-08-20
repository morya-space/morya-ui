import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiToggleButton from './ToggleButton.vue'

describe('WiToggleButton', () => {
  it('toggles modelValue and shows on/off labels', async () => {
    const wrapper = mount(WiToggleButton, {
      props: { modelValue: false, onLabel: 'Yes', offLabel: 'No' },
    })
    expect(wrapper.text()).toContain('No')
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('does not emit when disabled', async () => {
    const wrapper = mount(WiToggleButton, { props: { modelValue: true, disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.classes()).toContain('wi-togglebutton--disabled')
  })

  it('applies size classes', () => {
    expect(mount(WiToggleButton, { props: { size: 'small' } }).classes()).toContain('wi-togglebutton--small')
    expect(mount(WiToggleButton, { props: { size: 'lg' } }).classes()).toContain('wi-togglebutton--large')
  })
})
