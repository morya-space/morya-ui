import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiTextarea from './Textarea.vue'

describe('WiTextarea', () => {
  it('associates its label and emits model updates', async () => {
    const wrapper = mount(WiTextarea, { props: { id: 'notes', label: 'Notes' } })

    expect(wrapper.get('label').attributes('for')).toBe('notes')
    await wrapper.get('textarea').setValue('A project note')

    expect(wrapper.emitted('update:modelValue')).toEqual([['A project note']])
  })

  it('exposes invalid state and help text', () => {
    const wrapper = mount(WiTextarea, { props: { id: 'notes', invalid: true, helpText: 'Required' } })

    expect(wrapper.get('textarea').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('textarea').attributes('aria-describedby')).toBe('notes-help')
    expect(wrapper.get('textarea').classes()).toContain('wi-textarea--invalid')
  })

  it('maps size, variant, fluid, and autoResize', async () => {
    const wrapper = mount(WiTextarea, {
      props: { size: 'sm', variant: 'filled', fluid: true, autoResize: true, modelValue: 'line' },
    })

    expect(wrapper.classes()).toContain('wi-textarea-field--fluid')
    expect(wrapper.get('textarea').classes()).toEqual(
      expect.arrayContaining([
        'wi-textarea--small',
        'wi-textarea--filled',
        'wi-textarea--fluid',
        'wi-textarea--auto-resize',
      ]),
    )
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).style.resize).toBe('none')
  })
})
