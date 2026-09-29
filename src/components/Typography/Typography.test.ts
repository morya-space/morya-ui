import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MLink from './Link.vue'
import MParagraph from './Paragraph.vue'
import MText from './Text.vue'
import MTitle from './Title.vue'

describe('MTypography', () => {
  it('renders Title level=2 as h2', () => {
    const wrapper = mount(MTitle, {
      props: { level: 2 },
      slots: { default: 'Heading' },
    })
    expect(wrapper.element.tagName).toBe('H2')
    expect(wrapper.classes()).toContain('m-typography-title--h2')
    expect(wrapper.text()).toBe('Heading')
  })

  it('applies Text type=danger class', () => {
    const wrapper = mount(MText, {
      props: { type: 'danger' },
      slots: { default: 'Danger' },
    })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toContain('m-typography--danger')
  })

  it('renders Link with href', () => {
    const wrapper = mount(MLink, {
      props: { href: 'https://example.com' },
      slots: { default: 'Docs' },
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://example.com')
    expect(wrapper.classes()).toContain('m-typography-link')
  })

  it('renders Paragraph as p', () => {
    const wrapper = mount(MParagraph, {
      slots: { default: 'Body copy' },
    })
    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.classes()).toContain('m-typography-paragraph')
    expect(wrapper.text()).toBe('Body copy')
  })
})
