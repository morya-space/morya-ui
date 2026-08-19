import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdTextarea from './Textarea.vue'

describe('WdTextarea', () => {
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

  it('maps size, variant, fluid, and autoResize', async () => {
    const wrapper = mount(WdTextarea, {
      props: { size: 'sm', variant: 'filled', fluid: true, autoResize: true, modelValue: 'line' },
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
})
