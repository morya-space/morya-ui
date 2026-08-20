import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiStepper from './Stepper.vue'

const steps = [
  { label: 'Cart' },
  { label: 'Address' },
  { label: 'Pay', disabled: true },
]

describe('WiStepper', () => {
  it('emits active step index on click', async () => {
    const wrapper = mount(WiStepper, {
      props: { steps, modelValue: 0 },
    })
    const buttons = wrapper.findAll('.wi-stepper__step')
    await buttons[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
  })

  it('blocks future steps when linear and respects disabled', async () => {
    const wrapper = mount(WiStepper, {
      props: { steps, modelValue: 0, linear: true },
    })
    const buttons = wrapper.findAll('.wi-stepper__step')
    await buttons[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(buttons[2]!.attributes('disabled')).toBeDefined()
  })
})
