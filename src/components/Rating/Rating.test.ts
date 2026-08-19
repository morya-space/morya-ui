import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdRating from './Rating.vue'

describe('WdRating', () => {
  it('renders stars and emits selection', async () => {
    const wrapper = mount(WdRating, { props: { modelValue: 2, stars: 5 } })
    const stars = wrapper.findAll('.wd-rating__star')
    expect(stars).toHaveLength(5)
    expect(wrapper.findAll('.wd-rating__star--on')).toHaveLength(2)
    await stars[3]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[4]])
  })

  it('cancels rating when cancel is enabled', async () => {
    const wrapper = mount(WdRating, { props: { modelValue: 3, cancel: true } })
    await wrapper.get('.wd-rating__cancel').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[0]])
  })

  it('does not emit while readonly or disabled', async () => {
    const readonly = mount(WdRating, { props: { modelValue: 1, readonly: true } })
    await readonly.findAll('.wd-rating__star')[2]!.trigger('click')
    expect(readonly.emitted('update:modelValue')).toBeUndefined()

    const disabled = mount(WdRating, { props: { modelValue: 1, disabled: true, cancel: false } })
    expect(disabled.find('.wd-rating__cancel').exists()).toBe(false)
    await disabled.findAll('.wd-rating__star')[2]!.trigger('click')
    expect(disabled.emitted('update:modelValue')).toBeUndefined()
  })
})
