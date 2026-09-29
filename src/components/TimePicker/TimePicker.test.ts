import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import MTimePicker from './TimePicker.vue'

describe('MTimePicker', () => {
  it('opens a time-only panel and emits HH:mm when minute is picked', async () => {
    const wrapper = mount(MTimePicker, {
      props: { modelValue: '08:00' },
      attachTo: document.body,
    })
    await wrapper.find('.m-datepicker__input').trigger('click')
    await nextTick()

    const panel = document.body.querySelector('.m-datepicker__panel--time-only')
    expect(panel).toBeTruthy()

    const cols = document.body.querySelectorAll('.m-datepicker__time-col')
    const hourBtn = cols[0]!.querySelectorAll('.m-datepicker__time-item')[14] as HTMLButtonElement
    const minuteBtn = cols[1]!.querySelectorAll('.m-datepicker__time-item')[30] as HTMLButtonElement
    hourBtn.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    minuteBtn.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('14:30')
    wrapper.unmount()
  })
})
