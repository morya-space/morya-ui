import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MCard from './Card.vue'

describe('muCard', () => {
  it('renders built-in heading content and applies an accessible name', () => {
    const wrapper = mount(MCard, { props: { title: 'Project details', subtitle: 'Updated today' }, slots: { default: 'Content' } })
    expect(wrapper.get('.m-card__title').text()).toBe('Project details')
    expect(wrapper.get('.m-card__subtitle').text()).toBe('Updated today')
    expect(wrapper.attributes('aria-label')).toBe('Project details')
  })

  it('preserves header and footer slots', () => {
    const wrapper = mount(MCard, { slots: { header: 'Custom header', footer: 'Actions' } })
    expect(wrapper.get('.m-card__header').text()).toBe('Custom header')
    expect(wrapper.get('.m-card__footer').text()).toBe('Actions')
  })

  it('supports cover, hoverable, and borderless', () => {
    const wrapper = mount(MCard, {
      props: { hoverable: true, bordered: false, size: 'small' },
      slots: { cover: '<img alt="cover" src="https://example.com/c.png">' },
    })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['m-card--hoverable', 'm-card--borderless', 'm-card--small']),
    )
    expect(wrapper.get('.m-card__cover img').attributes('alt')).toBe('cover')
  })
})
