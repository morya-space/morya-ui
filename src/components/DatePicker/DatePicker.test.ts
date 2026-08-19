import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WdDatePicker from './DatePicker.vue'

describe('WdDatePicker', () => {
  it('opens calendar and emits ISO date', async () => {
    const wrapper = mount(WdDatePicker, { props: { modelValue: '2024-01-15' }, attachTo: document.body })
    await wrapper.find('.wd-datepicker__input').trigger('click')
    await nextTick()
    const panel = document.body.querySelector('.wd-datepicker__panel')
    expect(panel).toBeTruthy()
    const days = panel!.querySelectorAll('.wd-datepicker__day:not(.wd-datepicker__day--other)')
    ;(days[0] as HTMLButtonElement).click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    wrapper.unmount()
  })

  it('clears value and maps invalid class', async () => {
    const wrapper = mount(WdDatePicker, { props: { modelValue: '2024-06-01', invalid: true } })
    expect(wrapper.classes()).toContain('wd-datepicker--invalid')
    await wrapper.find('.wd-datepicker__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
  })

  it('teleports the panel to body by default', async () => {
    const wrapper = mount(WdDatePicker, { props: { modelValue: '2024-01-15' }, attachTo: document.body })
    await wrapper.find('.wd-datepicker__input').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.wd-datepicker__panel--teleported')).toBeTruthy()
    wrapper.unmount()
  })
})
