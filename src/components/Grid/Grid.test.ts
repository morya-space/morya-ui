import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WiGrid from './Grid.vue'
import WiGridItem from './GridItem.vue'

describe('wiGrid', () => {
  it('renders a css grid with items', () => {
    const wrapper = mount(WiGrid, {
      props: { cols: 12, xGap: 8, yGap: 8 },
      slots: {
        default: () => [
          h(WiGridItem, { span: 6 }, () => 'A'),
          h(WiGridItem, { span: 6 }, () => 'B'),
        ],
      },
    })
    expect(wrapper.classes()).toContain('wi-grid')
    expect(wrapper.element.style.gridTemplateColumns).toContain('repeat(12')
    expect(wrapper.findAll('.wi-grid-item')).toHaveLength(2)
  })

  it('hides overflowing items when collapsed', async () => {
    const wrapper = mount(WiGrid, {
      props: { cols: 4, collapsed: true, collapsedRows: 1 },
      slots: {
        default: () => [
          h(WiGridItem, { span: 2 }, () => 'A'),
          h(WiGridItem, { span: 2 }, () => 'B'),
          h(WiGridItem, { span: 2 }, () => 'C'),
        ],
      },
    })
    await wrapper.vm.$nextTick()
    const items = wrapper.findAll('.wi-grid-item')
    expect(items).toHaveLength(3)
    expect(items[2]!.element.style.display).toBe('none')
  })

  it('applies offset into grid-column span like naive-ui', async () => {
    const wrapper = mount(WiGrid, {
      props: { cols: 24 },
      slots: {
        default: () => [
          h(WiGridItem, { span: 1, offset: 2 }, () => 'A'),
          h(WiGridItem, { span: 1, offset: 1 }, () => 'B'),
        ],
      },
    })
    await wrapper.vm.$nextTick()
    const items = wrapper.findAll('.wi-grid-item')
    expect(items[0]!.attributes('style')).toContain('grid-column: span 3 / span 3')
    expect(items[1]!.attributes('style')).toContain('grid-column: span 2 / span 2')
  })

  it('resolves item span responsive strings when itemResponsive is on', async () => {
    const wrapper = mount(WiGrid, {
      props: { cols: 12, itemResponsive: true, xGap: 0 },
      slots: {
        default: () => [h(WiGridItem, { span: '1 m:4' }, () => 'A')],
      },
      attachTo: document.body,
    })
    Object.defineProperty(wrapper.get('.wi-grid').element, 'clientWidth', {
      configurable: true,
      get: () => 1200,
    })
    await wrapper.setProps({ xGap: 8 })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.wi-grid-item').attributes('style')).toContain('grid-column: span 4 / span 4')
    wrapper.unmount()
  })

  it('parses responsive cols strings', async () => {
    const wrapper = mount(WiGrid, {
      props: { cols: '2 m:6', yGap: 0 },
      slots: {
        default: () => [h(WiGridItem, { span: 1 }, () => 'A')],
      },
      attachTo: document.body,
    })
    Object.defineProperty(wrapper.get('.wi-grid').element, 'clientWidth', {
      configurable: true,
      get: () => 1200,
    })
    await wrapper.setProps({ yGap: 8 })
    await wrapper.vm.$nextTick()
    expect(wrapper.element.style.gridTemplateColumns).toContain('repeat(6')
    wrapper.unmount()
  })
})
