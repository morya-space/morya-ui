import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import WdInput from './Input.vue'

describe('wdInput', () => {
  it('associates its label and emits model updates', async () => {
    const wrapper = mount(WdInput, { props: { label: 'Email', id: 'email' } })
    expect(wrapper.get('label').attributes('for')).toBe('email')
    await wrapper.get('input').setValue('a@example.com')
    expect(wrapper.emitted('update:modelValue')).toEqual([['a@example.com']])
  })

  it('supports invalid state, clearing, and exposed focus', async () => {
    const wrapper = mount(WdInput, { props: { modelValue: 'Draft', invalid: true, clearable: true } })
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('input').classes()).toContain('wd-input--invalid')
    await wrapper.get('.wd-input__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('maps size, variant, and fluid props', () => {
    const small = mount(WdInput, { props: { size: 'small', variant: 'filled', fluid: true } })
    const legacy = mount(WdInput, { props: { size: 'lg', invalid: true } })

    expect(small.get('input').classes()).toEqual(
      expect.arrayContaining(['wd-input--small', 'wd-input--filled', 'wd-input--fluid']),
    )
    expect(small.classes()).toContain('wd-input-field--fluid')
    expect(legacy.get('input').classes()).toEqual(
      expect.arrayContaining(['wd-input--large', 'wd-input--invalid']),
    )
  })

  it('does not treat omitted fluid as true', () => {
    const wrapper = mount(WdInput, { props: { modelValue: '' } })
    expect(wrapper.classes()).not.toContain('wd-input-field--fluid')
  })

  it('applies maxlength and shows character count', () => {
    const wrapper = mount(WdInput, {
      props: { modelValue: 'Hello', maxlength: 20, showCount: true, id: 'bio' },
    })
    expect(wrapper.get('input').attributes('maxlength')).toBe('20')
    expect(wrapper.get('.wd-input-field__count').text()).toBe('5 / 20')
    expect(wrapper.get('input').attributes('aria-describedby')).toContain('bio-count')
  })

  it('renders prefix and suffix slots', () => {
    const wrapper = mount(WdInput, {
      props: { modelValue: '12', label: '金额' },
      slots: { prefix: () => '¥', suffix: () => '.00' },
    })
    expect(wrapper.get('.wd-input__prefix').text()).toBe('¥')
    expect(wrapper.get('.wd-input__suffix').text()).toBe('.00')
    expect(wrapper.get('input').classes()).toContain('wd-input--has-prefix')
    expect(wrapper.get('input').classes()).toContain('wd-input--has-suffix')
  })

  it('emits focus, blur, and change and exposes focus/blur/select', async () => {
    const wrapper = mount(WdInput, { props: { modelValue: 'hello' } })
    const input = wrapper.get('input')
    await input.trigger('focus')
    await input.trigger('blur')
    await input.setValue('world')
    await input.trigger('change')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(wrapper.emitted('change')?.[0]).toEqual(['world'])
    const selectSpy = vi.spyOn(input.element as HTMLInputElement, 'select')
    wrapper.vm.select()
    expect(selectSpy).toHaveBeenCalled()
  })
})
