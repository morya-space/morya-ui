import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MCalendar from './Calendar.vue'

describe('muCalendar', () => {
  it('renders day grid and selects a date', async () => {
    const wrapper = mount(MCalendar, { props: { modelValue: '2024-06-01' } })
    expect(wrapper.classes()).toContain('m-calendar--fullscreen')
    const inMonth = wrapper.findAll('.m-calendar__cell--date:not(.m-calendar__cell--other)')
    await inMonth[14]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('2024-06-15')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('applies card modifier when fullscreen is false', () => {
    const wrapper = mount(MCalendar, { props: { fullscreen: false } })
    expect(wrapper.classes()).toContain('m-calendar--card')
    expect(wrapper.classes()).not.toContain('m-calendar--fullscreen')
  })

  it('respects disabledDate', async () => {
    const wrapper = mount(MCalendar, {
      props: {
        modelValue: '2024-06-01',
        disabledDate: (d: Date) => d.getDate() === 1,
      },
    })
    const first = wrapper.find('.m-calendar__cell--date:not(.m-calendar__cell--other)')
    expect(first.attributes('disabled')).toBeDefined()
    await first.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('switches to month panel and back via mode control', async () => {
    const wrapper = mount(MCalendar, { props: { modelValue: '2024-06-15' } })
    const yearRadio = wrapper.find('.m-segmented__input[value="year"]')
    await yearRadio.setValue(true)
    await yearRadio.trigger('change')
    expect(wrapper.find('.m-calendar__body--months').exists()).toBe(true)
    await wrapper.find('.m-calendar__cell--month').trigger('click')
    expect(wrapper.emitted('update:mode')?.at(-1)?.[0]).toBe('month')
    expect(wrapper.find('.m-calendar__cell--date').exists()).toBe(true)
  })

  it('renders dateCell slot content', () => {
    const wrapper = mount(MCalendar, {
      props: { modelValue: '2024-06-01' },
      slots: {
        dateCell: `<template #dateCell="{ date }"><span class="evt">{{ date.getDate() }}</span></template>`,
      },
    })
    expect(wrapper.find('.evt').exists()).toBe(true)
  })

  it('shows week column when showWeek is true', () => {
    const wrapper = mount(MCalendar, { props: { modelValue: '2024-06-01', showWeek: true } })
    expect(wrapper.classes()).toContain('m-calendar--week')
    expect(wrapper.find('.m-calendar__week-num').exists()).toBe(true)
  })

  it('emits panelChange when header year changes', async () => {
    const wrapper = mount(MCalendar, {
      props: { modelValue: '2024-06-01' },
      global: {
        stubs: {
          MSelect: {
            props: ['modelValue', 'options', 'size'],
            emits: ['update:modelValue'],
            template:
              '<button type="button" class="year-stub" @click="$emit(\'update:modelValue\', 2025)" />',
          },
        },
      },
    })
    await wrapper.find('.year-stub').trigger('click')
    expect(wrapper.emitted('panelChange')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('2025-06-01')
  })
})
