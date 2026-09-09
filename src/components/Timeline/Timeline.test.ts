import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MTimeline from './Timeline.vue'

const value = [
  { status: 'Ordered', content: 'Order placed', date: '15/10', icon: '1' },
  { status: 'Shipped', content: 'On the way', date: '16/10', color: '#22c55e' },
]

describe('muTimeline', () => {
  it('renders events and alternate alignment', () => {
    const wrapper = mount(MTimeline, { props: { value, align: 'alternate' } })
    expect(wrapper.classes()).toContain('m-timeline--alternate')
    expect(wrapper.findAll('.m-timeline__event')).toHaveLength(2)
    expect(wrapper.text()).toContain('Order placed')
  })

  it('uses content and opposite slots', () => {
    const wrapper = mount(MTimeline, {
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
    const wrapper = mount(MTimeline, { props: { value, pending: 'Waiting' } })
    expect(wrapper.findAll('.m-timeline__event')).toHaveLength(3)
    expect(wrapper.find('.m-timeline__event--pending').text()).toContain('Waiting')
  })
})
