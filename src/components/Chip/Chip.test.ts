import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkChip from './Chip.vue'

describe('wkChip', () => {
  it('renders label and optional icon', () => {
    const wrapper = mount(WkChip, { props: { label: 'Vue', icon: 'check' } })
    expect(wrapper.find('.wk-chip__label').text()).toBe('Vue')
    expect(wrapper.find('.wk-chip__icon').exists()).toBe(true)
  })

  it('renders image when provided', () => {
    const wrapper = mount(WkChip, {
      props: { label: 'Photo', image: 'https://example.com/a.png', icon: 'check' },
    })
    expect(wrapper.find('.wk-chip__image').exists()).toBe(true)
    expect(wrapper.find('.wk-chip__icon').exists()).toBe(false)
  })

  it('emits remove when removable close is clicked', async () => {
    const wrapper = mount(WkChip, { props: { label: 'Tag', removable: true } })
    await wrapper.get('.wk-chip__remove').trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(wrapper.get('.wk-chip__remove .wk-icon').exists()).toBe(true)
  })

  it('does not emit remove while disabled', async () => {
    const wrapper = mount(WkChip, { props: { label: 'Tag', removable: true, disabled: true } })
    await wrapper.get('.wk-chip__remove').trigger('click')
    expect(wrapper.emitted('remove')).toBeUndefined()
    expect(wrapper.classes()).toContain('wk-chip--disabled')
  })

  it('applies size and severity', () => {
    const wrapper = mount(WkChip, { props: { label: 'Hot', size: 'small', severity: 'danger' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['wk-chip--small', 'wk-chip--danger']))
  })
})
