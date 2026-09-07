import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdCard from './Card.vue'

describe('rdCard', () => {
  it('renders built-in heading content and applies an accessible name', () => {
    const wrapper = mount(RdCard, { props: { title: 'Project details', subtitle: 'Updated today' }, slots: { default: 'Content' } })
    expect(wrapper.get('.rd-card__title').text()).toBe('Project details')
    expect(wrapper.get('.rd-card__subtitle').text()).toBe('Updated today')
    expect(wrapper.attributes('aria-label')).toBe('Project details')
  })

  it('preserves header and footer slots', () => {
    const wrapper = mount(RdCard, { slots: { header: 'Custom header', footer: 'Actions' } })
    expect(wrapper.get('.rd-card__header').text()).toBe('Custom header')
    expect(wrapper.get('.rd-card__footer').text()).toBe('Actions')
  })

  it('supports cover, hoverable, and borderless', () => {
    const wrapper = mount(RdCard, {
      props: { hoverable: true, bordered: false, size: 'small' },
      slots: { cover: '<img alt="cover" src="https://example.com/c.png">' },
    })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['rd-card--hoverable', 'rd-card--borderless', 'rd-card--small']),
    )
    expect(wrapper.get('.rd-card__cover img').attributes('alt')).toBe('cover')
  })
})
