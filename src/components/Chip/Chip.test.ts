import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiChip from './Chip.vue'

describe('WiChip', () => {
  it('renders label and optional icon', () => {
    const wrapper = mount(WiChip, { props: { label: 'Vue', icon: 'check' } })
    expect(wrapper.find('.wi-chip__label').text()).toBe('Vue')
    expect(wrapper.find('.wi-chip__icon').exists()).toBe(true)
  })

  it('renders image when provided', () => {
    const wrapper = mount(WiChip, {
      props: { label: 'Photo', image: 'https://example.com/a.png', icon: 'check' },
    })
    expect(wrapper.find('.wi-chip__image').exists()).toBe(true)
    expect(wrapper.find('.wi-chip__icon').exists()).toBe(false)
  })

  it('emits remove when removable close is clicked', async () => {
    const wrapper = mount(WiChip, { props: { label: 'Tag', removable: true } })
    await wrapper.get('.wi-chip__remove').trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(wrapper.get('.wi-chip__remove').text()).toBe('×')
  })

  it('does not emit remove while disabled', async () => {
    const wrapper = mount(WiChip, { props: { label: 'Tag', removable: true, disabled: true } })
    await wrapper.get('.wi-chip__remove').trigger('click')
    expect(wrapper.emitted('remove')).toBeUndefined()
    expect(wrapper.classes()).toContain('wi-chip--disabled')
  })
})
