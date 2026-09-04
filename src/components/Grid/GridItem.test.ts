import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WdGrid from './Grid.vue'
import WdGridItem from './GridItem.vue'

describe('GridItem', () => {
  it('spans columns inside a grid parent', async () => {
    const wrapper = mount(WdGrid, {
      props: { cols: 12 },
      slots: {
        default: () => h(WdGridItem, { span: 4, offset: 2 }, () => 'Cell'),
      },
    })
    await wrapper.vm.$nextTick()
    const item = wrapper.get('.wd-grid-item')
    expect(item.text()).toBe('Cell')
    expect(item.attributes('style')).toContain('grid-column: span 6 / span 6')
  })
})
