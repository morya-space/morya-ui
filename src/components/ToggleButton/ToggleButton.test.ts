import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MToggleButton from './ToggleButton.vue'

describe('muToggleButton', () => {
  it('toggles modelValue and shows on/off labels', async () => {
    const wrapper = mount(MToggleButton, {
      props: { modelValue: false, onLabel: 'Yes', offLabel: 'No' },
    })
    expect(wrapper.text()).toContain('No')
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('does not emit when disabled', async () => {
    const wrapper = mount(MToggleButton, { props: { modelValue: true, disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.classes()).toContain('m-togglebutton--disabled')
  })

  it('applies size classes', () => {
    expect(mount(MToggleButton, { props: { size: 'small' } }).classes()).toContain('m-togglebutton--small')
    expect(mount(MToggleButton, { props: { size: 'lg' } }).classes()).toContain('m-togglebutton--large')
  })
})
