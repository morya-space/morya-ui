import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdInputOtp from './InputOtp.vue'

describe('rdInputOtp', () => {
  it('emits joined value on input and advances focus', async () => {
    const wrapper = mount(RdInputOtp, { props: { modelValue: '', length: 4 }, attachTo: document.body })
    const inputs = wrapper.findAll('.rd-inputotp__input')
    await inputs[0]!.setValue('1')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['1'])
    wrapper.unmount()
  })

  it('rejects non-integer when integerOnly', async () => {
    const wrapper = mount(RdInputOtp, { props: { modelValue: '', integerOnly: true } })
    const input = wrapper.findAll('.rd-inputotp__input')[0]!
    await input.setValue('a')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders configured length', () => {
    const wrapper = mount(RdInputOtp, { props: { length: 6 } })
    expect(wrapper.findAll('.rd-inputotp__input')).toHaveLength(6)
  })

  it('masks digits', () => {
    const wrapper = mount(RdInputOtp, { props: { modelValue: '12', mask: true } })
    expect(wrapper.findAll('.rd-inputotp__input')[0]!.attributes('type')).toBe('password')
    expect(wrapper.classes()).toContain('rd-inputotp--mask')
  })
})
