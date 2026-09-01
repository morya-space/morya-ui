import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WiDatePicker from './DatePicker.vue'

describe('wiDatePicker', () => {
  it('opens calendar and emits ISO date', async () => {
    const wrapper = mount(WiDatePicker, { props: { modelValue: '2024-01-15' }, attachTo: document.body })
    await wrapper.find('.wi-datepicker__input').trigger('click')
    await nextTick()
    const panel = document.body.querySelector('.wi-datepicker__panel')
    expect(panel).toBeTruthy()
    const days = panel!.querySelectorAll('.wi-datepicker__day:not(.wi-datepicker__day--other)')
    ;(days[0] as HTMLButtonElement).click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    wrapper.unmount()
  })

  it('clears value and maps invalid class', async () => {
    const wrapper = mount(WiDatePicker, { props: { modelValue: '2024-06-01', invalid: true } })
    expect(wrapper.classes()).toContain('wi-datepicker--invalid')
    await wrapper.find('.wi-datepicker__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('teleports the panel to body by default', async () => {
    const wrapper = mount(WiDatePicker, { props: { modelValue: '2024-01-15' }, attachTo: document.body })
    await wrapper.find('.wi-datepicker__input').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.wi-datepicker__panel--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('picks a date range across two clicks', async () => {
    const wrapper = mount(WiDatePicker, {
      props: { type: 'daterange', modelValue: null },
      attachTo: document.body,
    })
    await wrapper.find('.wi-datepicker__input').trigger('click')
    await nextTick()
    const panel = document.body.querySelector('.wi-datepicker__panel')
    const days = panel!.querySelectorAll('.wi-datepicker__day:not(.wi-datepicker__day--other)')
    ;(days[0] as HTMLButtonElement).click()
    ;(days[2] as HTMLButtonElement).click()
    await nextTick()
    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as [string, string]
    expect(Array.isArray(value)).toBe(true)
    expect(value[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(value[1]).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(value[0] <= value[1]).toBe(true)
    wrapper.unmount()
  })

  it('applies a shortcut', async () => {
    const wrapper = mount(WiDatePicker, {
      props: {
        shortcuts: [{ label: 'Fixed', value: '2024-02-01' }],
      },
      attachTo: document.body,
    })
    await wrapper.find('.wi-datepicker__input').trigger('click')
    await nextTick()
    ;(document.body.querySelector('.wi-datepicker__shortcut') as HTMLButtonElement).click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2024-02-01'])
    wrapper.unmount()
  })
})
