import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MCard from './Card.vue'
import './style'

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

  it('supports cover, shadow hover, and borderless', () => {
    const wrapper = mount(MCard, {
      props: { shadow: 'hover', bordered: false, size: 'small' },
      slots: { cover: '<img alt="cover" src="https://example.com/c.png">' },
    })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['m-card--shadow-hover', 'm-card--borderless', 'm-card--small']),
    )
    expect(wrapper.get('.m-card__cover img').attributes('alt')).toBe('cover')
  })

  it('applies shadow timing modifiers', () => {
    const hover = mount(MCard, { props: { shadow: 'hover' }, slots: { default: 'Body' } })
    expect(hover.classes()).toContain('m-card--shadow-hover')

    const always = mount(MCard, {
      props: { shadow: 'always' },
      slots: { default: 'Body' },
      attachTo: document.body,
    })
    expect(always.classes()).toContain('m-card--shadow-always')
    expect(getComputedStyle(always.element).boxShadow).not.toBe('none')
    always.unmount()
  })
})
