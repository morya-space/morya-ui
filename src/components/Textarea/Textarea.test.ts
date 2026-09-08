import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkTextarea from './Textarea.vue'

describe('wkTextarea', () => {
  it('associates its label and emits model updates', async () => {
    const wrapper = mount(WkTextarea, { props: { id: 'notes', label: 'Notes' } })

    expect(wrapper.get('label').attributes('for')).toBe('notes')
    await wrapper.get('textarea').setValue('A project note')

    expect(wrapper.emitted('update:modelValue')).toEqual([['A project note']])
  })

  it('exposes invalid state and help text', () => {
    const wrapper = mount(WkTextarea, { props: { id: 'notes', invalid: true, helpText: 'Required' } })

    expect(wrapper.get('textarea').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('textarea').attributes('aria-describedby')).toBe('notes-help')
    expect(wrapper.get('textarea').classes()).toContain('wk-textarea--invalid')
  })

  it('maps size, variant, fluid, and autosize', async () => {
    const wrapper = mount(WkTextarea, {
      props: { size: 'sm', variant: 'filled', fluid: true, autosize: true, modelValue: 'line' },
    })

    expect(wrapper.classes()).toContain('wk-textarea-field--fluid')
    expect(wrapper.get('textarea').classes()).toEqual(
      expect.arrayContaining([
        'wk-textarea--small',
        'wk-textarea--filled',
        'wk-textarea--fluid',
        'wk-textarea--auto-resize',
      ]),
    )
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).style.resize).toBe('none')
  })

  it('supports clearable, count, and autosize row clamp', async () => {
    const wrapper = mount(WkTextarea, {
      props: {
        modelValue: 'Hello',
        clearable: true,
        showCount: true,
        maxlength: 20,
        autosize: { minRows: 3, maxRows: 6 },
        id: 'notes',
      },
    })
    expect(wrapper.get('textarea').attributes('rows')).toBe('3')
    expect(wrapper.get('textarea').classes()).toContain('wk-textarea--auto-resize')
    expect(wrapper.get('.wk-textarea-field__count').text()).toBe('5 / 20')
    expect(wrapper.get('textarea').attributes('aria-describedby')).toContain('notes-count')
    await wrapper.get('.wk-textarea__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
