import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WiDatePicker from './DatePicker.vue'

describe('WiDatePicker', () => {
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
  })

  it('teleports the panel to body by default', async () => {
    const wrapper = mount(WiDatePicker, { props: { modelValue: '2024-01-15' }, attachTo: document.body })
    await wrapper.find('.wi-datepicker__input').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.wi-datepicker__panel--teleported')).toBeTruthy()
    wrapper.unmount()
  })
})
