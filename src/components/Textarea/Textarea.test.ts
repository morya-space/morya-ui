import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdTextarea from './Textarea.vue'

describe('wdTextarea', () => {
  it('associates its label and emits model updates', async () => {
    const wrapper = mount(WdTextarea, { props: { id: 'notes', label: 'Notes' } })

    expect(wrapper.get('label').attributes('for')).toBe('notes')
    await wrapper.get('textarea').setValue('A project note')

    expect(wrapper.emitted('update:modelValue')).toEqual([['A project note']])
  })

  it('exposes invalid state and help text', () => {
    const wrapper = mount(WdTextarea, { props: { id: 'notes', invalid: true, helpText: 'Required' } })

    expect(wrapper.get('textarea').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('textarea').attributes('aria-describedby')).toBe('notes-help')
    expect(wrapper.get('textarea').classes()).toContain('wd-textarea--invalid')
  })

  it('maps size, variant, fluid, and autosize', async () => {
    const wrapper = mount(WdTextarea, {
      props: { size: 'sm', variant: 'filled', fluid: true, autosize: true, modelValue: 'line' },
    })

    expect(wrapper.classes()).toContain('wd-textarea-field--fluid')
    expect(wrapper.get('textarea').classes()).toEqual(
      expect.arrayContaining([
        'wd-textarea--small',
        'wd-textarea--filled',
        'wd-textarea--fluid',
        'wd-textarea--auto-resize',
      ]),
    )
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).style.resize).toBe('none')
  })

  it('supports clearable, count, and autosize row clamp', async () => {
    const wrapper = mount(WdTextarea, {
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
    expect(wrapper.get('textarea').classes()).toContain('wd-textarea--auto-resize')
    expect(wrapper.get('.wd-textarea-field__count').text()).toBe('5 / 20')
    expect(wrapper.get('textarea').attributes('aria-describedby')).toContain('notes-count')
    await wrapper.get('.wd-textarea__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
