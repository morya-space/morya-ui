import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdTimeline from './Timeline.vue'

const value = [
  { status: 'Ordered', content: 'Order placed', date: '15/10', icon: '1' },
  { status: 'Shipped', content: 'On the way', date: '16/10', color: '#22c55e' },
]

describe('rdTimeline', () => {
  it('renders events and alternate alignment', () => {
    const wrapper = mount(RdTimeline, { props: { value, align: 'alternate' } })
    expect(wrapper.classes()).toContain('rd-timeline--alternate')
    expect(wrapper.findAll('.rd-timeline__event')).toHaveLength(2)
    expect(wrapper.text()).toContain('Order placed')
  })

  it('uses content and opposite slots', () => {
    const wrapper = mount(RdTimeline, {
      props: { value },
      slots: {
        content: ({ item }: { item: { status?: string } }) => `C:${item.status}`,
        opposite: ({ item }: { item: { date?: string } }) => `O:${item.date}`,
      },
    })
    expect(wrapper.text()).toContain('C:Ordered')
    expect(wrapper.text()).toContain('O:15/10')
  })

  it('appends a pending item', () => {
    const wrapper = mount(RdTimeline, { props: { value, pending: 'Waiting' } })
    expect(wrapper.findAll('.rd-timeline__event')).toHaveLength(3)
    expect(wrapper.find('.rd-timeline__event--pending').text()).toContain('Waiting')
  })
})
