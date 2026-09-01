import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WiGrid from './Grid.vue'
import WiGridItem from './GridItem.vue'

describe('GridItem', () => {
  it('spans columns inside a grid parent', async () => {
    const wrapper = mount(WiGrid, {
      props: { cols: 12 },
      slots: {
        default: () => h(WiGridItem, { span: 4, offset: 2 }, () => 'Cell'),
      },
    })
    await wrapper.vm.$nextTick()
    const item = wrapper.get('.wi-grid-item')
    expect(item.text()).toBe('Cell')
    expect(item.attributes('style')).toContain('grid-column: span 6 / span 6')
  })
})
