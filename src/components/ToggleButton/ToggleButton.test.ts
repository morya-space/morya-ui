import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdToggleButton from './ToggleButton.vue'

describe('rdToggleButton', () => {
  it('toggles modelValue and shows on/off labels', async () => {
    const wrapper = mount(RdToggleButton, {
      props: { modelValue: false, onLabel: 'Yes', offLabel: 'No' },
    })
    expect(wrapper.text()).toContain('No')
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('does not emit when disabled', async () => {
    const wrapper = mount(RdToggleButton, { props: { modelValue: true, disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.classes()).toContain('rd-togglebutton--disabled')
  })

  it('applies size classes', () => {
    expect(mount(RdToggleButton, { props: { size: 'small' } }).classes()).toContain('rd-togglebutton--small')
    expect(mount(RdToggleButton, { props: { size: 'lg' } }).classes()).toContain('rd-togglebutton--large')
  })
})
