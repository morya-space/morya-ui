import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiSelectButton from './SelectButton.vue'

const options = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right', disabled: true },
]

describe('wiSelectButton', () => {
  it('emits single selection', async () => {
    const wrapper = mount(WiSelectButton, { props: { options, modelValue: 'left' } })
    const buttons = wrapper.findAll('.wi-selectbutton__button')
    await buttons[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['center']])
    expect(buttons[0]!.classes()).toContain('wi-selectbutton__button--active')
  })

  it('supports multiple selection and ignores disabled options', async () => {
    const wrapper = mount(WiSelectButton, {
      props: { options, multiple: true, modelValue: ['left'] },
    })
    const buttons = wrapper.findAll('.wi-selectbutton__button')
    await buttons[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['left', 'center']])
    await buttons[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.length).toBe(1)
  })

  it('maps size and invalid classes', () => {
    const wrapper = mount(WiSelectButton, {
      props: { options, size: 'large', invalid: true },
    })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['wi-selectbutton--large', 'wi-selectbutton--invalid']),
    )
  })
})
