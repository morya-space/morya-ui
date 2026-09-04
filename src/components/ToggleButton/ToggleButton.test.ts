import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdToggleButton from './ToggleButton.vue'

describe('wdToggleButton', () => {
  it('toggles modelValue and shows on/off labels', async () => {
    const wrapper = mount(WdToggleButton, {
      props: { modelValue: false, onLabel: 'Yes', offLabel: 'No' },
    })
    expect(wrapper.text()).toContain('No')
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('does not emit when disabled', async () => {
    const wrapper = mount(WdToggleButton, { props: { modelValue: true, disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.classes()).toContain('wd-togglebutton--disabled')
  })

  it('applies size classes', () => {
    expect(mount(WdToggleButton, { props: { size: 'small' } }).classes()).toContain('wd-togglebutton--small')
    expect(mount(WdToggleButton, { props: { size: 'lg' } }).classes()).toContain('wd-togglebutton--large')
  })
})
