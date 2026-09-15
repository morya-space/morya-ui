import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MPageContent from './PageContent.vue'
import MPageFilters from './PageFilters.vue'
import MPageHeader from './PageHeader.vue'
import MPageSection from './PageSection.vue'
import MPageToolbar from './PageToolbar.vue'

describe('mPageContent', () => {
  it('applies density and width modifiers', () => {
    const wrapper = mount(MPageContent, {
      props: { density: 'spacious', width: 'narrow' },
      slots: { default: '<p class="child">Body</p>' },
    })
    expect(wrapper.classes()).toContain('m-page-content')
    expect(wrapper.classes()).toContain('m-page-content--spacious')
    expect(wrapper.classes()).toContain('m-page-content--narrow')
    expect(wrapper.find('.child').exists()).toBe(true)
  })
})

describe('mPageFilters', () => {
  it('renders a labelled filter section', () => {
    const wrapper = mount(MPageFilters, {
      props: { ariaLabel: 'Filters' },
      slots: { default: '<span>Filter</span>' },
    })
    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.attributes('aria-label')).toBe('Filters')
    expect(wrapper.classes()).toContain('m-page-filters')
  })
})

describe('mPageToolbar', () => {
  it('renders title and actions slot', () => {
    const wrapper = mount(MPageToolbar, {
      props: { title: 'Users' },
      slots: { actions: '<button type="button">Create</button>' },
    })
    expect(wrapper.find('.m-page-toolbar__title').text()).toBe('Users')
    expect(wrapper.find('.m-page-toolbar__actions button').exists()).toBe(true)
  })
})

describe('mPageHeader', () => {
  it('renders title, description, and actions', () => {
    const wrapper = mount(MPageHeader, {
      props: { title: 'Create user', description: 'Fill in the form.' },
      slots: { actions: '<button type="button">Help</button>' },
    })
    expect(wrapper.find('.m-page-header__title').text()).toBe('Create user')
    expect(wrapper.find('.m-page-header__description').text()).toBe('Fill in the form.')
    expect(wrapper.find('.m-page-header__actions button').exists()).toBe(true)
  })
})

describe('mPageSection', () => {
  it('applies form variant class', () => {
    const wrapper = mount(MPageSection, {
      props: { variant: 'form', title: 'Details' },
      slots: { default: '<p class="field">Field</p>' },
    })
    expect(wrapper.classes()).toContain('m-page-section--form')
    expect(wrapper.find('.m-page-section__title').text()).toBe('Details')
  })
})
