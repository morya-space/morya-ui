import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdChip from './Chip.vue'

describe('rdChip', () => {
  it('renders label and optional icon', () => {
    const wrapper = mount(RdChip, { props: { label: 'Vue', icon: 'check' } })
    expect(wrapper.find('.rd-chip__label').text()).toBe('Vue')
    expect(wrapper.find('.rd-chip__icon').exists()).toBe(true)
  })

  it('renders image when provided', () => {
    const wrapper = mount(RdChip, {
      props: { label: 'Photo', image: 'https://example.com/a.png', icon: 'check' },
    })
    expect(wrapper.find('.rd-chip__image').exists()).toBe(true)
    expect(wrapper.find('.rd-chip__icon').exists()).toBe(false)
  })

  it('emits remove when removable close is clicked', async () => {
    const wrapper = mount(RdChip, { props: { label: 'Tag', removable: true } })
    await wrapper.get('.rd-chip__remove').trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(wrapper.get('.rd-chip__remove .rd-icon').exists()).toBe(true)
  })

  it('does not emit remove while disabled', async () => {
    const wrapper = mount(RdChip, { props: { label: 'Tag', removable: true, disabled: true } })
    await wrapper.get('.rd-chip__remove').trigger('click')
    expect(wrapper.emitted('remove')).toBeUndefined()
    expect(wrapper.classes()).toContain('rd-chip--disabled')
  })

  it('applies size and severity', () => {
    const wrapper = mount(RdChip, { props: { label: 'Hot', size: 'small', severity: 'danger' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['rd-chip--small', 'rd-chip--danger']))
  })
})
