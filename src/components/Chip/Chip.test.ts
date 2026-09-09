import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MChip from './Chip.vue'

describe('muChip', () => {
  it('renders label and optional icon', () => {
    const wrapper = mount(MChip, { props: { label: 'Vue', icon: 'check' } })
    expect(wrapper.find('.m-chip__label').text()).toBe('Vue')
    expect(wrapper.find('.m-chip__icon').exists()).toBe(true)
  })

  it('renders image when provided', () => {
    const wrapper = mount(MChip, {
      props: { label: 'Photo', image: 'https://example.com/a.png', icon: 'check' },
    })
    expect(wrapper.find('.m-chip__image').exists()).toBe(true)
    expect(wrapper.find('.m-chip__icon').exists()).toBe(false)
  })

  it('emits remove when removable close is clicked', async () => {
    const wrapper = mount(MChip, { props: { label: 'Tag', removable: true } })
    await wrapper.get('.m-chip__remove').trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(wrapper.get('.m-chip__remove .m-icon').exists()).toBe(true)
  })

  it('does not emit remove while disabled', async () => {
    const wrapper = mount(MChip, { props: { label: 'Tag', removable: true, disabled: true } })
    await wrapper.get('.m-chip__remove').trigger('click')
    expect(wrapper.emitted('remove')).toBeUndefined()
    expect(wrapper.classes()).toContain('m-chip--disabled')
  })

  it('applies size and severity', () => {
    const wrapper = mount(MChip, { props: { label: 'Hot', size: 'small', severity: 'danger' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['m-chip--small', 'm-chip--danger']))
  })
})
