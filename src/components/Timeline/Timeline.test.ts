import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdTimeline from './Timeline.vue'

const value = [
  { status: 'Ordered', content: 'Order placed', date: '15/10', icon: '1' },
  { status: 'Shipped', content: 'On the way', date: '16/10', color: '#22c55e' },
]

describe('WdTimeline', () => {
  it('renders events and alternate alignment', () => {
    const wrapper = mount(WdTimeline, { props: { value, align: 'alternate' } })
    expect(wrapper.classes()).toContain('wd-timeline--alternate')
    expect(wrapper.findAll('.wd-timeline__event')).toHaveLength(2)
    expect(wrapper.text()).toContain('Order placed')
  })

  it('uses content and opposite slots', () => {
    const wrapper = mount(WdTimeline, {
      props: { value },
      slots: {
        content: ({ item }: { item: { status?: string } }) => `C:${item.status}`,
        opposite: ({ item }: { item: { date?: string } }) => `O:${item.date}`,
      },
    })
    expect(wrapper.text()).toContain('C:Ordered')
    expect(wrapper.text()).toContain('O:15/10')
  })
})
