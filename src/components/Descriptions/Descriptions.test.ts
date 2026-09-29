import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import MDescriptions from './Descriptions.vue'
import MDescriptionsItem from './DescriptionsItem.vue'

function mountDescriptions(props: Record<string, unknown> = {}, itemCount = 3) {
  const Comp = defineComponent({
    setup() {
      return () =>
        h(
          MDescriptions,
          props,
          {
            default: () =>
              Array.from({ length: itemCount }, (_, i) =>
                h(
                  MDescriptionsItem,
                  { label: `L${i}`, span: i === 0 ? 2 : 1 },
                  () => `V${i}`,
                ),
              ),
            title: () => 'User',
            extra: () => h('button', { type: 'button' }, 'Edit'),
          },
        )
    },
  })
  return mount(Comp)
}

describe('muDescriptions', () => {
  it('renders header title and extra', () => {
    const wrapper = mountDescriptions({ title: 'Profile' })
    expect(wrapper.find('.m-descriptions__title').text()).toBe('User')
    expect(wrapper.find('.m-descriptions__extra button').text()).toBe('Edit')
  })

  it('applies bordered and vertical modifiers', () => {
    const wrapper = mountDescriptions({ bordered: true, layout: 'vertical', column: 2 })
    expect(wrapper.find('.m-descriptions').classes()).toEqual(
      expect.arrayContaining(['m-descriptions--bordered', 'm-descriptions--vertical']),
    )
    expect(wrapper.find('.m-descriptions__view').attributes('style')).toContain('--m-descriptions-cols: 2')
  })

  it('renders items with colon and span', () => {
    const wrapper = mountDescriptions({ colon: true })
    const items = wrapper.findAll('.m-descriptions__item')
    expect(items).toHaveLength(3)
    expect(items[0]!.attributes('style')).toContain('span 2')
    expect(wrapper.find('.m-descriptions__colon').exists()).toBe(true)
    expect(wrapper.text()).toContain('V0')
  })

  it('hides colon when colon=false', () => {
    const wrapper = mountDescriptions({ colon: false })
    expect(wrapper.find('.m-descriptions__colon').exists()).toBe(false)
  })
})
