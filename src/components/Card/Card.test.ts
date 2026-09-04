import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdCard from './Card.vue'

describe('wdCard', () => {
  it('renders built-in heading content and applies an accessible name', () => {
    const wrapper = mount(WdCard, { props: { title: 'Project details', subtitle: 'Updated today' }, slots: { default: 'Content' } })
    expect(wrapper.get('.wd-card__title').text()).toBe('Project details')
    expect(wrapper.get('.wd-card__subtitle').text()).toBe('Updated today')
    expect(wrapper.attributes('aria-label')).toBe('Project details')
  })

  it('preserves header and footer slots', () => {
    const wrapper = mount(WdCard, { slots: { header: 'Custom header', footer: 'Actions' } })
    expect(wrapper.get('.wd-card__header').text()).toBe('Custom header')
    expect(wrapper.get('.wd-card__footer').text()).toBe('Actions')
  })

  it('supports cover, hoverable, and borderless', () => {
    const wrapper = mount(WdCard, {
      props: { hoverable: true, bordered: false, size: 'small' },
      slots: { cover: '<img alt="cover" src="https://example.com/c.png">' },
    })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['wd-card--hoverable', 'wd-card--borderless', 'wd-card--small']),
    )
    expect(wrapper.get('.wd-card__cover img').attributes('alt')).toBe('cover')
  })
})
