import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkCard from './Card.vue'

describe('wkCard', () => {
  it('renders built-in heading content and applies an accessible name', () => {
    const wrapper = mount(WkCard, { props: { title: 'Project details', subtitle: 'Updated today' }, slots: { default: 'Content' } })
    expect(wrapper.get('.wk-card__title').text()).toBe('Project details')
    expect(wrapper.get('.wk-card__subtitle').text()).toBe('Updated today')
    expect(wrapper.attributes('aria-label')).toBe('Project details')
  })

  it('preserves header and footer slots', () => {
    const wrapper = mount(WkCard, { slots: { header: 'Custom header', footer: 'Actions' } })
    expect(wrapper.get('.wk-card__header').text()).toBe('Custom header')
    expect(wrapper.get('.wk-card__footer').text()).toBe('Actions')
  })

  it('supports cover, hoverable, and borderless', () => {
    const wrapper = mount(WkCard, {
      props: { hoverable: true, bordered: false, size: 'small' },
      slots: { cover: '<img alt="cover" src="https://example.com/c.png">' },
    })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['wk-card--hoverable', 'wk-card--borderless', 'wk-card--small']),
    )
    expect(wrapper.get('.wk-card__cover img').attributes('alt')).toBe('cover')
  })
})
