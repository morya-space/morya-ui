import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdFlex from './Flex.vue'

describe('wdFlex', () => {
  it('renders children with flex display', () => {
    const wrapper = mount(WdFlex, {
      slots: { default: '<span class="a">A</span><span class="b">B</span>' },
    })
    expect(wrapper.classes()).toContain('wd-flex')
    expect(wrapper.element.style.display).toBe('flex')
    expect(wrapper.findAll('.a, .b')).toHaveLength(2)
  })

  it('supports vertical and reverse', () => {
    const wrapper = mount(WdFlex, {
      props: { vertical: true, reverse: true, justify: 'center', align: 'end' },
      slots: { default: '<span>A</span>' },
    })
    expect(wrapper.element.style.flexDirection).toBe('column-reverse')
    expect(wrapper.element.style.justifyContent).toBe('center')
    expect(wrapper.element.style.alignItems).toBe('flex-end')
  })

  it('uses numeric gap', () => {
    const wrapper = mount(WdFlex, {
      props: { size: 12 },
      slots: { default: '<span>A</span>' },
    })
    expect(wrapper.element.style.gap).toBe('12px')
  })
})
