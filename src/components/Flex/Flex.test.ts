import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MFlex from './Flex.vue'

describe('muFlex', () => {
  it('renders children with flex display', () => {
    const wrapper = mount(MFlex, {
      slots: { default: '<span class="a">A</span><span class="b">B</span>' },
    })
    expect(wrapper.classes()).toContain('m-flex')
    expect(wrapper.element.style.display).toBe('flex')
    expect(wrapper.findAll('.a, .b')).toHaveLength(2)
  })

  it('supports vertical and reverse', () => {
    const wrapper = mount(MFlex, {
      props: { vertical: true, reverse: true, justify: 'center', align: 'end' },
      slots: { default: '<span>A</span>' },
    })
    expect(wrapper.element.style.flexDirection).toBe('column-reverse')
    expect(wrapper.element.style.justifyContent).toBe('center')
    expect(wrapper.element.style.alignItems).toBe('flex-end')
  })

  it('uses numeric gap', () => {
    const wrapper = mount(MFlex, {
      props: { size: 12 },
      slots: { default: '<span>A</span>' },
    })
    expect(wrapper.element.style.gap).toBe('12px')
  })

  it('uses gap as an alias of size', () => {
    const wrapper = mount(MFlex, {
      props: { gap: 'large' },
      slots: { default: '<span>A</span>' },
    })
    expect(wrapper.element.style.gap).toBe('var(--m-space-4)')
  })

  it('supports wrap and vertical', () => {
    const horizontal = mount(MFlex, {
      props: { wrap: false },
      slots: { default: '<span>A</span>' },
    })
    expect(horizontal.element.style.flexWrap).toBe('nowrap')

    const vertical = mount(MFlex, {
      props: { vertical: true, wrap: true },
      slots: { default: '<span>A</span>' },
    })
    expect(vertical.element.style.flexDirection).toBe('column')
    expect(vertical.element.style.flexWrap).toBe('nowrap')
  })
})
