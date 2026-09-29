import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { getActiveMention, filterMentionOptions, normalizeMentionOption } from './mentionUtils'
import MMentions from './Mentions.vue'

const users = ['afc163', 'benjyew', 'zombieJ', 'yesmeck']

describe('mentionUtils', () => {
  it('detects active mention after prefix', () => {
    const text = 'hello @af world'
    expect(getActiveMention(text, 9, ['@'], ' ')).toEqual({
      prefix: '@',
      query: 'af',
      start: 6,
    })
  })

  it('filters options by query', () => {
    const options = users.map((value) => normalizeMentionOption(value))
    expect(filterMentionOptions(options, 'af').map((o) => o.value)).toEqual(['afc163'])
  })
})

describe('MMentions', () => {
  it('opens suggestions and inserts mention on click', async () => {
    const wrapper = mount(MMentions, {
      props: { modelValue: 'Hi @af', options: users },
      attachTo: document.body,
    })
    const textarea = wrapper.get('textarea')
    textarea.element.setSelectionRange(6, 6)
    await textarea.trigger('input')
    await textarea.trigger('keyup')
    expect(wrapper.find('.m-mentions__dropdown').exists()).toBe(true)
    await wrapper.find('.m-mentions__option').trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Hi @afc163 '])
    expect(wrapper.emitted('select')?.at(-1)?.[0]).toEqual({ value: 'afc163', label: 'afc163' })
    wrapper.unmount()
  })

  it('supports allowClear alias and loading panel', async () => {
    const clearable = mount(MMentions, {
      props: { modelValue: 'Hi', options: users, allowClear: true },
    })
    await clearable.get('.m-mentions__clear').trigger('click')
    expect(clearable.emitted('update:modelValue')).toEqual([['']])

    const loading = mount(MMentions, {
      props: { modelValue: 'Hi @', options: [], loading: true },
      attachTo: document.body,
    })
    const textarea = loading.get('textarea')
    textarea.element.setSelectionRange(4, 4)
    await textarea.trigger('input')
    await textarea.trigger('keyup')
    expect(loading.find('.m-mentions__dropdown--loading').exists()).toBe(true)
    loading.unmount()
  })

  it('maps status classes', () => {
    const wrapper = mount(MMentions, {
      props: { options: users, status: 'warning' },
    })
    expect(wrapper.classes()).toContain('m-mentions--warning')
  })
})
