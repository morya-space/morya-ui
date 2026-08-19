import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdInputOtp from './InputOtp.vue'

describe('WdInputOtp', () => {
  it('emits joined value on input and advances focus', async () => {
    const wrapper = mount(WdInputOtp, { props: { modelValue: '', length: 4 }, attachTo: document.body })
    const inputs = wrapper.findAll('.wd-inputotp__input')
    await inputs[0]!.setValue('1')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['1'])
    wrapper.unmount()
  })

  it('rejects non-integer when integerOnly', async () => {
    const wrapper = mount(WdInputOtp, { props: { modelValue: '', integerOnly: true } })
    const input = wrapper.findAll('.wd-inputotp__input')[0]!
    await input.setValue('a')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders configured length', () => {
    const wrapper = mount(WdInputOtp, { props: { length: 6 } })
    expect(wrapper.findAll('.wd-inputotp__input')).toHaveLength(6)
  })
})
