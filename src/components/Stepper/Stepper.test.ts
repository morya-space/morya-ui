import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdStepper from './Stepper.vue'

const steps = [
  { label: 'Cart' },
  { label: 'Address' },
  { label: 'Pay', disabled: true },
]

describe('wdStepper', () => {
  it('emits active step index on click', async () => {
    const wrapper = mount(WdStepper, {
      props: { steps, modelValue: 0 },
    })
    const buttons = wrapper.findAll('.wd-stepper__step')
    await buttons[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
  })

  it('blocks future steps when linear and respects disabled', async () => {
    const wrapper = mount(WdStepper, {
      props: { steps, modelValue: 0, linear: true },
    })
    const buttons = wrapper.findAll('.wd-stepper__step')
    await buttons[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(buttons[2]!.attributes('disabled')).toBeDefined()
  })

  it('renders vertical layout with descriptions', () => {
    const wrapper = mount(WdStepper, {
      props: {
        vertical: true,
        steps: [
          { label: 'One', description: 'Start' },
          { label: 'Two', status: 'error' },
        ],
      },
    })
    expect(wrapper.get('.wd-stepper').classes()).toContain('wd-stepper--vertical')
    expect(wrapper.get('.wd-stepper__description').text()).toBe('Start')
    expect(wrapper.find('.wd-stepper__step--error').exists()).toBe(true)
  })
})
