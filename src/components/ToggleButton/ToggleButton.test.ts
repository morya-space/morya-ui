import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkToggleButton from './ToggleButton.vue'

describe('wkToggleButton', () => {
  it('toggles modelValue and shows on/off labels', async () => {
    const wrapper = mount(WkToggleButton, {
      props: { modelValue: false, onLabel: 'Yes', offLabel: 'No' },
    })
    expect(wrapper.text()).toContain('No')
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('does not emit when disabled', async () => {
    const wrapper = mount(WkToggleButton, { props: { modelValue: true, disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.classes()).toContain('wk-togglebutton--disabled')
  })

  it('applies size classes', () => {
    expect(mount(WkToggleButton, { props: { size: 'small' } }).classes()).toContain('wk-togglebutton--small')
    expect(mount(WkToggleButton, { props: { size: 'lg' } }).classes()).toContain('wk-togglebutton--large')
  })
})
