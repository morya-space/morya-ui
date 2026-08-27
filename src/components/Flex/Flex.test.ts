import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiFlex from './Flex.vue'

describe('wiFlex', () => {
  it('renders children with flex display', () => {
    const wrapper = mount(WiFlex, {
      slots: { default: '<span class="a">A</span><span class="b">B</span>' },
    })
    expect(wrapper.classes()).toContain('wi-flex')
    expect(wrapper.element.style.display).toBe('flex')
    expect(wrapper.findAll('.a, .b')).toHaveLength(2)
  })

  it('supports vertical and reverse', () => {
    const wrapper = mount(WiFlex, {
      props: { vertical: true, reverse: true, justify: 'center', align: 'end' },
      slots: { default: '<span>A</span>' },
    })
    expect(wrapper.element.style.flexDirection).toBe('column-reverse')
    expect(wrapper.element.style.justifyContent).toBe('center')
    expect(wrapper.element.style.alignItems).toBe('flex-end')
  })

  it('uses numeric gap', () => {
    const wrapper = mount(WiFlex, {
      props: { size: 12 },
      slots: { default: '<span>A</span>' },
    })
    expect(wrapper.element.style.gap).toBe('12px')
  })
})
