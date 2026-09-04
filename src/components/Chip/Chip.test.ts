import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdChip from './Chip.vue'

describe('wdChip', () => {
  it('renders label and optional icon', () => {
    const wrapper = mount(WdChip, { props: { label: 'Vue', icon: 'check' } })
    expect(wrapper.find('.wd-chip__label').text()).toBe('Vue')
    expect(wrapper.find('.wd-chip__icon').exists()).toBe(true)
  })

  it('renders image when provided', () => {
    const wrapper = mount(WdChip, {
      props: { label: 'Photo', image: 'https://example.com/a.png', icon: 'check' },
    })
    expect(wrapper.find('.wd-chip__image').exists()).toBe(true)
    expect(wrapper.find('.wd-chip__icon').exists()).toBe(false)
  })

  it('emits remove when removable close is clicked', async () => {
    const wrapper = mount(WdChip, { props: { label: 'Tag', removable: true } })
    await wrapper.get('.wd-chip__remove').trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(wrapper.get('.wd-chip__remove .wd-icon').exists()).toBe(true)
  })

  it('does not emit remove while disabled', async () => {
    const wrapper = mount(WdChip, { props: { label: 'Tag', removable: true, disabled: true } })
    await wrapper.get('.wd-chip__remove').trigger('click')
    expect(wrapper.emitted('remove')).toBeUndefined()
    expect(wrapper.classes()).toContain('wd-chip--disabled')
  })

  it('applies size and severity', () => {
    const wrapper = mount(WdChip, { props: { label: 'Hot', size: 'small', severity: 'danger' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['wd-chip--small', 'wd-chip--danger']))
  })
})
