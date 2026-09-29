import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import MDatePicker from './DatePicker.vue'

describe('muDatePicker', () => {
  it('opens calendar and emits ISO date', async () => {
    const wrapper = mount(MDatePicker, { props: { modelValue: '2024-01-15' }, attachTo: document.body })
    await wrapper.find('.m-datepicker__input').trigger('click')
    await nextTick()
    const panel = document.body.querySelector('.m-datepicker__panel')
    expect(panel).toBeTruthy()
    const days = panel!.querySelectorAll('.m-datepicker__day:not(.m-datepicker__day--other)')
    ;(days[0] as HTMLButtonElement).click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    wrapper.unmount()
  })

  it('clears value and maps invalid class', async () => {
    const wrapper = mount(MDatePicker, { props: { modelValue: '2024-06-01', invalid: true } })
    expect(wrapper.classes()).toContain('m-datepicker--invalid')
    await wrapper.find('.m-datepicker__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('teleports the panel to body by default', async () => {
    const wrapper = mount(MDatePicker, { props: { modelValue: '2024-01-15' }, attachTo: document.body })
    await wrapper.find('.m-datepicker__input').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.m-datepicker__panel--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('picks a date range across two clicks', async () => {
    const wrapper = mount(MDatePicker, {
      props: { type: 'daterange', modelValue: null },
      attachTo: document.body,
    })
    await wrapper.find('.m-datepicker__input').trigger('click')
    await nextTick()
    const panel = document.body.querySelector('.m-datepicker__panel')
    const days = panel!.querySelectorAll('.m-datepicker__day:not(.m-datepicker__day--other)')
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
    const wrapper = mount(MDatePicker, {
      props: {
        shortcuts: [{ label: 'Fixed', value: '2024-02-01' }],
      },
      attachTo: document.body,
    })
    await wrapper.find('.m-datepicker__input').trigger('click')
    await nextTick()
    ;(document.body.querySelector('.m-datepicker__shortcut') as HTMLButtonElement).click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2024-02-01'])
    wrapper.unmount()
  })

  it('associates label with input via for/id', () => {
    const wrapper = mount(MDatePicker, { props: { label: '开始日期', modelValue: null } })
    const label = wrapper.get('.m-datepicker__label')
    const input = wrapper.get('.m-datepicker__input')
    expect(label.attributes('for')).toBe(input.attributes('id'))
  })

  it('renders error/help feedback and wires aria-describedby', () => {
    const wrapper = mount(MDatePicker, {
      props: { modelValue: null, errorMessage: '日期无效' },
    })
    const help = wrapper.get('.m-datepicker__help')
    expect(help.text()).toBe('日期无效')
    expect(help.classes()).toContain('m-datepicker__help--invalid')
    expect(wrapper.get('.m-datepicker__input').attributes('aria-describedby')).toBe(help.attributes('id'))
  })

  it('supports full keyboard date selection in the grid', async () => {
    const wrapper = mount(MDatePicker, {
      props: { modelValue: '2024-01-15' },
      attachTo: document.body,
    })
    const input = wrapper.get('.m-datepicker__input')
    await input.trigger('click')
    await nextTick()
    await nextTick()

    expect(wrapper.emitted('show')).toHaveLength(1)
    const grid = document.body.querySelector('.m-datepicker__grid') as HTMLElement
    expect(grid.getAttribute('role')).toBe('grid')
    const day15 = document.body.querySelector('[data-m-date="2024-01-15"]') as HTMLButtonElement
    expect(day15.getAttribute('role')).toBe('gridcell')
    expect(day15.getAttribute('aria-selected')).toBe('true')
    expect(day15.tabIndex).toBe(0)
    expect(document.activeElement).toBe(day15)

    grid.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await nextTick()
    const day16 = document.body.querySelector('[data-m-date="2024-01-16"]') as HTMLButtonElement
    expect(document.activeElement).toBe(day16)
    expect(day16.tabIndex).toBe(0)
    expect(day15.tabIndex).toBe(-1)

    grid.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2024-01-16'])
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['2024-01-16'])
    expect(document.body.querySelector('.m-datepicker__panel')).toBeNull()
    expect(document.activeElement).toBe(input.element)
    expect(wrapper.emitted('hide')).toHaveLength(1)
    wrapper.unmount()
  })

  it('closes on Escape and returns focus to the input', async () => {
    const wrapper = mount(MDatePicker, {
      props: { modelValue: '2024-01-15' },
      attachTo: document.body,
    })
    const input = wrapper.get('.m-datepicker__input')
    await input.trigger('click')
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(document.body.querySelector('.m-datepicker__panel')).toBeNull()
    expect(document.activeElement).toBe(input.element)
    wrapper.unmount()
  })

  it('exposes combobox semantics aligned with Select when open', async () => {
    const wrapper = mount(MDatePicker, {
      props: { modelValue: '2024-01-15', invalid: true, errorMessage: 'Required' },
      attachTo: document.body,
    })
    const input = wrapper.get('.m-datepicker__input')
    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('.m-datepicker__help').text()).toBe('Required')
    await input.trigger('click')
    await nextTick()
    const panel = document.body.querySelector('.m-datepicker__panel') as HTMLElement
    expect(input.attributes('aria-controls')).toBe(panel.id)
    expect(input.attributes('aria-expanded')).toBe('true')
    wrapper.unmount()
  })

  it('emits YYYY-MM for month type', async () => {
    const wrapper = mount(MDatePicker, {
      props: { type: 'month', modelValue: '2024-01' },
      attachTo: document.body,
    })
    await wrapper.find('.m-datepicker__input').trigger('click')
    await nextTick()
    const cells = document.body.querySelectorAll('.m-datepicker__month-grid .m-datepicker__cell')
    ;(cells[5] as HTMLButtonElement).click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('2024-06')
    wrapper.unmount()
  })

  it('emits YYYY for year type', async () => {
    const wrapper = mount(MDatePicker, {
      props: { type: 'year', modelValue: '2024' },
      attachTo: document.body,
    })
    await wrapper.find('.m-datepicker__input').trigger('click')
    await nextTick()
    const cells = document.body.querySelectorAll('.m-datepicker__year-grid .m-datepicker__cell')
    const target = Array.from(cells).find((el) => el.textContent?.trim() === '2025') as HTMLButtonElement
    target.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('2025')
    wrapper.unmount()
  })

  it('emits HH:mm for time type when minute is picked', async () => {
    const wrapper = mount(MDatePicker, {
      props: { type: 'time', modelValue: '08:00' },
      attachTo: document.body,
    })
    await wrapper.find('.m-datepicker__input').trigger('click')
    await nextTick()
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

  it('emits YYYY-MM-DD HH:mm for datetime after day + minute', async () => {
    const wrapper = mount(MDatePicker, {
      props: { type: 'datetime', modelValue: '2024-01-15 09:00' },
      attachTo: document.body,
    })
    await wrapper.find('.m-datepicker__input').trigger('click')
    await nextTick()
    const day = document.body.querySelector('[data-m-date="2024-01-16"]') as HTMLButtonElement
    day.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    const cols = document.body.querySelectorAll('.m-datepicker__time-col')
    const minuteBtn = cols[1]!.querySelectorAll('.m-datepicker__time-item')[45] as HTMLButtonElement
    minuteBtn.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('2024-01-16 09:45')
    wrapper.unmount()
  })
})
