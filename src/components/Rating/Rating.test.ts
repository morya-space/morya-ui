import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkRating from './Rating.vue'

describe('wkRating', () => {
  it('renders stars and emits selection', async () => {
    const wrapper = mount(WkRating, { props: { modelValue: 2, stars: 5 } })
    const stars = wrapper.findAll('.wk-rating__star')
    expect(stars).toHaveLength(5)
    expect(wrapper.findAll('.wk-rating__star--on')).toHaveLength(2)
    await stars[3]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[4]])
  })

  it('cancels rating when cancel is enabled', async () => {
    const wrapper = mount(WkRating, { props: { modelValue: 3, cancel: true } })
    await wrapper.get('.wk-rating__cancel').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[0]])
  })

  it('does not emit while readonly or disabled', async () => {
    const readonly = mount(WkRating, { props: { modelValue: 1, readonly: true } })
    await readonly.findAll('.wk-rating__star')[2]!.trigger('click')
    expect(readonly.emitted('update:modelValue')).toBeUndefined()

    const disabled = mount(WkRating, { props: { modelValue: 1, disabled: true, cancel: false } })
    expect(disabled.find('.wk-rating__cancel').exists()).toBe(false)
    await disabled.findAll('.wk-rating__star')[2]!.trigger('click')
    expect(disabled.emitted('update:modelValue')).toBeUndefined()
  })

  it('supports half stars and allowClear alias', async () => {
    const wrapper = mount(WkRating, { props: { modelValue: 1, allowHalf: true, allowClear: false } })
    expect(wrapper.find('.wk-rating__cancel').exists()).toBe(false)
    const star = wrapper.findAll('.wk-rating__star')[1]!
    await star.trigger('click', { clientX: 0 })
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBeTypeOf('number')
    expect(wrapper.get('.wk-rating').classes()).toContain('wk-rating--half')
  })

  it('exposes slider semantics with label and value text', () => {
    const wrapper = mount(WkRating, { props: { modelValue: 3, stars: 5 } })
    const slider = wrapper.get('[role="slider"]')
    expect(slider.attributes('tabindex')).toBe('0')
    expect(slider.attributes('aria-label')).toBe('评分')
    expect(slider.attributes('aria-valuenow')).toBe('3')
    expect(slider.attributes('aria-valuetext')).toBe('3 星')
    expect(slider.attributes('aria-valuemax')).toBe('5')
  })

  it('supports arrow/Home/End keyboard control with shift half-step', async () => {
    const wrapper = mount(WkRating, {
      props: {
        modelValue: 2,
        stars: 5,
        allowHalf: true,
        'onUpdate:modelValue': (value: number) => wrapper.setProps({ modelValue: value }),
      },
    })
    const slider = wrapper.get('[role="slider"]')
    await slider.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([3])
    await slider.trigger('keydown', { key: 'ArrowLeft', shiftKey: true })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2.5])
    await slider.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([5])
    await slider.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0])
  })

  it('does not respond to keys when readonly', async () => {
    const wrapper = mount(WkRating, { props: { modelValue: 2, readonly: true } })
    await wrapper.get('[role="slider"]').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
