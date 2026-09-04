import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdSelectButton from './SelectButton.vue'

const options = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right', disabled: true },
]

describe('wdSelectButton', () => {
  it('emits single selection', async () => {
    const wrapper = mount(WdSelectButton, { props: { options, modelValue: 'left' } })
    const buttons = wrapper.findAll('.wd-selectbutton__button')
    await buttons[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['center']])
    expect(buttons[0]!.classes()).toContain('wd-selectbutton__button--active')
  })

  it('supports multiple selection and ignores disabled options', async () => {
    const wrapper = mount(WdSelectButton, {
      props: { options, multiple: true, modelValue: ['left'] },
    })
    const buttons = wrapper.findAll('.wd-selectbutton__button')
    await buttons[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['left', 'center']])
    await buttons[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.length).toBe(1)
  })

  it('maps size and invalid classes', () => {
    const wrapper = mount(WdSelectButton, {
      props: { options, size: 'large', invalid: true },
    })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['wd-selectbutton--large', 'wd-selectbutton--invalid']),
    )
  })

  it('supports group roving tabindex and arrow keys', async () => {
    const wrapper = mount(WdSelectButton, {
      props: { options, modelValue: 'left' },
      attachTo: document.body,
    })
    const buttons = () => wrapper.findAll('.wd-selectbutton__button')
    expect(buttons()[0]!.attributes('tabindex')).toBe('0')
    expect(buttons()[1]!.attributes('tabindex')).toBe('-1')

    const group = wrapper.get('.wd-selectbutton')
    await group.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(buttons()[0]!.element)

    // skips disabled Right and wraps back to Left
    await group.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(buttons()[1]!.element)

    await group.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['center'])
    wrapper.unmount()
  })
})
