import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import MInput from './Input.vue'

describe('muInput', () => {
  it('associates its label and emits model updates', async () => {
    const wrapper = mount(MInput, { props: { label: 'Email', id: 'email' } })
    expect(wrapper.get('label').attributes('for')).toBe('email')
    await wrapper.get('input').setValue('a@example.com')
    expect(wrapper.emitted('update:modelValue')).toEqual([['a@example.com']])
  })

  it('supports invalid state, clearing, and exposed focus', async () => {
    const wrapper = mount(MInput, { props: { modelValue: 'Draft', invalid: true, clearable: true } })
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('input').classes()).toContain('m-input--invalid')
    await wrapper.get('.m-input__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('maps size, variant, and fluid props', () => {
    const small = mount(MInput, { props: { size: 'small', variant: 'filled', fluid: true } })
    const legacy = mount(MInput, { props: { size: 'lg', invalid: true } })

    expect(small.get('input').classes()).toEqual(
      expect.arrayContaining(['m-input--small', 'm-input--filled', 'm-input--fluid']),
    )
    expect(small.classes()).toContain('m-input-field--fluid')
    expect(legacy.get('input').classes()).toEqual(
      expect.arrayContaining(['m-input--large', 'm-input--invalid']),
    )
  })

  it('does not treat omitted fluid as true', () => {
    const wrapper = mount(MInput, { props: { modelValue: '' } })
    expect(wrapper.classes()).not.toContain('m-input-field--fluid')
  })

  it('applies maxlength and shows character count', () => {
    const wrapper = mount(MInput, {
      props: { modelValue: 'Hello', maxlength: 20, showCount: true, id: 'bio' },
    })
    expect(wrapper.get('input').attributes('maxlength')).toBe('20')
    expect(wrapper.get('.m-input-field__count').text()).toBe('5 / 20')
    expect(wrapper.get('input').attributes('aria-describedby')).toContain('bio-count')
  })

  it('renders prefix and suffix slots', () => {
    const wrapper = mount(MInput, {
      props: { modelValue: '12', label: '金额' },
      slots: { prefix: () => '¥', suffix: () => '.00' },
    })
    expect(wrapper.get('.m-input__prefix').text()).toBe('¥')
    expect(wrapper.get('.m-input__suffix').text()).toBe('.00')
    expect(wrapper.get('input').classes()).toContain('m-input--has-prefix')
    expect(wrapper.get('input').classes()).toContain('m-input--has-suffix')
  })

  it('emits focus, blur, and change and exposes focus/blur/select', async () => {
    const wrapper = mount(MInput, { props: { modelValue: 'hello' } })
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
