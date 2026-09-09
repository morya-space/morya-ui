import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import MGrid from './Grid.vue'
import MGridItem from './GridItem.vue'

describe('GridItem', () => {
  it('spans columns inside a grid parent', async () => {
    const wrapper = mount(MGrid, {
      props: { cols: 12 },
      slots: {
        default: () => h(MGridItem, { span: 4, offset: 2 }, () => 'Cell'),
      },
    })
    await wrapper.vm.$nextTick()
    const item = wrapper.get('.m-grid-item')
    expect(item.text()).toBe('Cell')
    expect(item.attributes('style')).toContain('grid-column: span 6 / span 6')
  })
})
