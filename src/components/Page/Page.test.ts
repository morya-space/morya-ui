import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MPageContent from './PageContent.vue'
import MPageFilterChips from './PageFilterChips.vue'
import MPageFilters from './PageFilters.vue'
import MPageHeader from './PageHeader.vue'
import MPagePlaceholder from './PagePlaceholder.vue'
import MPageSection from './PageSection.vue'
import MPageStat from './PageStat.vue'
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

  it('opts into uniform band spacing', () => {
    const wrapper = mount(MPageContent, {
      props: { bands: 'uniform' },
      slots: { default: '<span />' },
    })
    expect(wrapper.classes()).toContain('m-page-content--bands-uniform')
  })

  it('opts into fill remaining height for list pages', () => {
    const wrapper = mount(MPageContent, {
      props: { fill: true },
      slots: { default: '<span />' },
    })
    expect(wrapper.classes()).toContain('m-page-content--fill')
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

  it('is plain by default and opts into the filled surface', () => {
    const plain = mount(MPageFilters, { slots: { default: '<span />' } })
    expect(plain.classes()).not.toContain('m-page-filters--filled')

    const filled = mount(MPageFilters, {
      props: { variant: 'filled' },
      slots: { default: '<span />' },
    })
    expect(filled.classes()).toContain('m-page-filters--filled')
  })

  it('toggles the advanced slot when collapsible', async () => {
    const wrapper = mount(MPageFilters, {
      props: { collapsible: true, expanded: false, ariaLabel: 'Filters' },
      slots: {
        default: '<span class="main">Main</span>',
        advanced: '<span class="advanced">Advanced</span>',
      },
    })
    expect(wrapper.find('.advanced').exists()).toBe(false)
    const toggle = wrapper.find('.m-page-filters__toggle')
    expect(toggle.exists()).toBe(true)
    expect(toggle.text()).toContain('高级筛选')
    await toggle.trigger('click')
    expect(wrapper.emitted('update:expanded')?.[0]).toEqual([true])
  })

  it('shows collapse label and chevron-up when expanded', () => {
    const wrapper = mount(MPageFilters, {
      props: { collapsible: true, expanded: true, ariaLabel: 'Filters' },
      slots: {
        default: '<span />',
        advanced: '<span class="advanced">Advanced</span>',
      },
    })
    expect(wrapper.find('.advanced').exists()).toBe(true)
    const toggle = wrapper.find('.m-page-filters__toggle')
    expect(toggle.text()).toContain('收起')
    expect(toggle.html()).toMatch(/chevron-up|m-icon/)
  })

  it('renders query actions in the trailing cluster', () => {
    const wrapper = mount(MPageFilters, {
      props: { ariaLabel: 'Filters' },
      slots: {
        default: '<span class="field">Field</span>',
        actions: '<button type="button" class="query">查询</button>',
      },
    })
    expect(wrapper.find('.m-page-filters__trailing .query').exists()).toBe(true)
    expect(wrapper.find('.m-page-filters__controls .query').exists()).toBe(false)
  })
})

describe('mPageFilterChips', () => {
  it('renders an active filter list with optional label', () => {
    const wrapper = mount(MPageFilterChips, {
      props: { label: 'Active', ariaLabel: 'Active filters' },
      slots: { default: '<span class="chip">A</span>' },
    })
    expect(wrapper.attributes('role')).toBe('list')
    expect(wrapper.attributes('aria-label')).toBe('Active filters')
    expect(wrapper.find('.m-page-filter-chips__label').text()).toBe('Active')
    expect(wrapper.find('.chip').exists()).toBe(true)
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

  it('renders breadcrumb and tags slots around the title', () => {
    const wrapper = mount(MPageHeader, {
      props: { title: 'Users' },
      slots: {
        breadcrumb: '<nav class="crumb">Home / Users</nav>',
        tags: '<span class="tag">Beta</span>',
      },
    })
    expect(wrapper.find('.m-page-header__breadcrumb .crumb').exists()).toBe(true)
    expect(wrapper.find('.m-page-header__heading .m-page-header__title').exists()).toBe(true)
    expect(wrapper.find('.m-page-header__tags .tag').text()).toBe('Beta')
  })
})

describe('mPageSection', () => {
  it('applies form variant class', () => {
    const wrapper = mount(MPageSection, {
      props: { variant: 'form', title: 'Details' },
      slots: { default: '<p class="field">Field</p>' },
    })
    expect(wrapper.classes()).toContain('m-page-section--form')
    expect(wrapper.classes()).toContain('m-card')
    expect(wrapper.find('.m-page-section__title').text()).toBe('Details')
  })

  it('renders a header row with actions slot', () => {
    const wrapper = mount(MPageSection, {
      props: { title: 'Members' },
      slots: { actions: '<button type="button">Invite</button>' },
    })
    expect(wrapper.find('.m-page-section__header').exists()).toBe(true)
    expect(wrapper.find('.m-page-section__actions button').text()).toBe('Invite')
  })

  it('omits the header row when neither title nor actions are given', () => {
    const wrapper = mount(MPageSection, {
      slots: { default: '<p>Body</p>' },
    })
    expect(wrapper.find('.m-page-section__header').exists()).toBe(false)
  })
})

describe('mPageStat', () => {
  it('renders label, value, and trend with direction icon', () => {
    const wrapper = mount(MPageStat, {
      props: {
        label: 'Total users',
        value: '12,480',
        trend: '+8.2%',
        trendDirection: 'up',
        trendLabel: 'vs last month',
        trendSeverity: 'success',
      },
    })
    expect(wrapper.find('.m-page-stat__label').text()).toBe('Total users')
    expect(wrapper.find('.m-page-stat__value').text()).toBe('12,480')
    const trend = wrapper.find('.m-page-stat__trend')
    expect(trend.classes()).toContain('m-page-stat__trend--success')
    expect(trend.text()).toContain('+8.2%')
    expect(trend.find('.m-page-stat__trend-icon').exists()).toBe(true)
    expect(wrapper.find('.m-page-stat__trend-label').text()).toBe('vs last month')
  })

  it('defaults to always shadow and accepts shadow override', () => {
    const flat = mount(MPageStat, { props: { label: 'Users', value: 42 } })
    expect(flat.find('.m-card').classes()).toContain('m-card--shadow-always')

    const hover = mount(MPageStat, { props: { label: 'Users', value: 42, shadow: 'hover' } })
    expect(hover.find('.m-card').classes()).toContain('m-card--shadow-hover')
  })

  it('supports plain layout and inline orientation', () => {
    const wrapper = mount(MPageStat, {
      props: {
        label: 'Orders',
        value: 128,
        layout: 'plain',
        orientation: 'inline',
        density: 'compact',
      },
    })
    expect(wrapper.find('.m-card').exists()).toBe(false)
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['m-page-stat--plain', 'm-page-stat--inline', 'm-page-stat--compact']),
    )
  })

  it('renders a muted icon beside the metric', () => {
    const wrapper = mount(MPageStat, {
      props: { label: 'Users', value: 42, icon: 'user' },
    })
    expect(wrapper.find('.m-page-stat__icon .m-icon').exists()).toBe(true)
  })

  it('shows skeletons while loading', () => {
    const wrapper = mount(MPageStat, {
      props: { label: 'Users', value: 42, trend: '+1%', loading: true },
    })
    expect(wrapper.findAll('.m-skeleton').length).toBeGreaterThan(0)
    expect(wrapper.find('.m-page-stat__value').exists()).toBe(false)
    expect(wrapper.find('.m-page-stat__trend').exists()).toBe(false)
  })
})

describe('mPagePlaceholder', () => {
  it('composes MEmpty inside the placeholder region', () => {
    const wrapper = mount(MPagePlaceholder, {
      props: { description: 'Chart renders here.', ariaLabel: 'Chart placeholder' },
    })
    expect(wrapper.classes()).toContain('m-page-placeholder')
    const empty = wrapper.find('.m-page-placeholder__empty')
    expect(empty.exists()).toBe(true)
    expect(empty.attributes('role')).toBe('status')
    expect(empty.text()).toContain('Chart renders here.')
  })

  it('forwards the extra slot to MEmpty', () => {
    const wrapper = mount(MPagePlaceholder, {
      slots: { extra: '<button type="button">Connect data</button>' },
    })
    expect(wrapper.find('.m-empty__extra button').text()).toBe('Connect data')
  })
})
