import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiInput from './Input.vue'

describe('wiInput', () => {
  it('associates its label and emits model updates', async () => {
    const wrapper = mount(WiInput, { props: { label: 'Email', id: 'email' } })
    expect(wrapper.get('label').attributes('for')).toBe('email')
    await wrapper.get('input').setValue('a@example.com')
    expect(wrapper.emitted('update:modelValue')).toEqual([['a@example.com']])
  })

  it('supports invalid aliases, clearing, and exposed focus', async () => {
    const wrapper = mount(WiInput, { props: { modelValue: 'Draft', invalid: true, clearable: true } })
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('input').classes()).toContain('wi-input--invalid')
    expect(wrapper.get('input').classes()).toContain('wi-input--error')
    await wrapper.get('.wi-input__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('maps size, variant, and fluid props', () => {
    const small = mount(WiInput, { props: { size: 'small', variant: 'filled', fluid: true } })
    const legacy = mount(WiInput, { props: { size: 'lg', error: true } })

    expect(small.get('input').classes()).toEqual(
      expect.arrayContaining(['wi-input--small', 'wi-input--filled', 'wi-input--fluid']),
    )
    expect(small.classes()).toContain('wi-input-field--fluid')
    expect(legacy.get('input').classes()).toEqual(
      expect.arrayContaining(['wi-input--large', 'wi-input--invalid', 'wi-input--error']),
    )
  })

  it('does not treat omitted fluid as true', () => {
    const wrapper = mount(WiInput, { props: { modelValue: '' } })
    expect(wrapper.classes()).not.toContain('wi-input-field--fluid')
  })

  it('applies maxlength and shows character count', () => {
    const wrapper = mount(WiInput, {
      props: { modelValue: 'Hello', maxlength: 20, showCount: true, id: 'bio' },
    })
    expect(wrapper.get('input').attributes('maxlength')).toBe('20')
    expect(wrapper.get('.wi-input-field__count').text()).toBe('5 / 20')
    expect(wrapper.get('input').attributes('aria-describedby')).toContain('bio-count')
  })

  it('renders prefix and suffix slots', () => {
    const wrapper = mount(WiInput, {
      props: { modelValue: '12', label: '金额' },
      slots: { prefix: () => '¥', suffix: () => '.00' },
    })
    expect(wrapper.get('.wi-input__prefix').text()).toBe('¥')
    expect(wrapper.get('.wi-input__suffix').text()).toBe('.00')
    expect(wrapper.get('input').classes()).toContain('wi-input--has-prefix')
    expect(wrapper.get('input').classes()).toContain('wi-input--has-suffix')
  })
})
