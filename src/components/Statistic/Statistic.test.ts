import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import MStatistic from './Statistic.vue'
import MStatisticCountdown from './StatisticCountdown.vue'

describe('muStatistic', () => {
  it('renders title and formatted value with precision', () => {
    const wrapper = mount(MStatistic, {
      props: {
        title: 'Balance',
        value: 112893.1234,
        precision: 2,
        prefix: '$',
      },
    })
    expect(wrapper.find('.m-statistic__title').text()).toBe('Balance')
    expect(wrapper.find('.m-statistic__value').text()).toBe('112,893.12')
    expect(wrapper.find('.m-statistic__prefix').text()).toBe('$')
  })

  it('uses custom formatter', () => {
    const wrapper = mount(MStatistic, {
      props: {
        value: 42,
        formatter: (v) => `≈ ${v}`,
      },
    })
    expect(wrapper.find('.m-statistic__value').text()).toBe('≈ 42')
  })

  it('shows skeleton when loading', () => {
    const wrapper = mount(MStatistic, {
      props: { loading: true, value: 1 },
    })
    expect(wrapper.find('.m-skeleton').exists()).toBe(true)
  })
})

describe('muStatisticCountdown', () => {
  it('renders countdown string and emits finish when elapsed', async () => {
    vi.useFakeTimers()
    const now = Date.now()
    const wrapper = mount(MStatisticCountdown, {
      props: {
        title: 'Deadline',
        value: now + 1500,
        format: 's',
        onFinish: vi.fn(),
      },
    })
    expect(wrapper.find('.m-statistic__value').text()).toMatch(/\d/)
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('finish')).toHaveLength(1)
    vi.useRealTimers()
  })
})
