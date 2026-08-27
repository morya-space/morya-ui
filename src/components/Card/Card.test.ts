import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiCard from './Card.vue'

describe('wiCard', () => {
  it('renders built-in heading content and applies an accessible name', () => {
    const wrapper = mount(WiCard, { props: { title: 'Project details', subtitle: 'Updated today' }, slots: { default: 'Content' } })
    expect(wrapper.get('.wi-card__title').text()).toBe('Project details')
    expect(wrapper.get('.wi-card__subtitle').text()).toBe('Updated today')
    expect(wrapper.attributes('aria-label')).toBe('Project details')
  })

  it('preserves header and footer slots', () => {
    const wrapper = mount(WiCard, { slots: { header: 'Custom header', footer: 'Actions' } })
    expect(wrapper.get('.wi-card__header').text()).toBe('Custom header')
    expect(wrapper.get('.wi-card__footer').text()).toBe('Actions')
  })

  it('supports cover, hoverable, and borderless', () => {
    const wrapper = mount(WiCard, {
      props: { hoverable: true, bordered: false, size: 'small' },
      slots: { cover: '<img alt="cover" src="https://example.com/c.png">' },
    })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['wi-card--hoverable', 'wi-card--borderless', 'wi-card--small']),
    )
    expect(wrapper.get('.wi-card__cover img').attributes('alt')).toBe('cover')
  })
})
