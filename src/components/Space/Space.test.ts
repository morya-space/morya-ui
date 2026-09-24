import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MSpace from './Space.vue'

describe('muSpace', () => {
  it('wraps children by default', () => {
    const wrapper = mount(MSpace, {
      slots: { default: '<span class="a">A</span><span class="b">B</span>' },
    })
    expect(wrapper.classes()).toContain('m-space')
    expect(wrapper.findAll('.m-space__item')).toHaveLength(2)
    expect(wrapper.find('.a').exists()).toBe(true)
  })

  it('can skip item wrapping', () => {
    const wrapper = mount(MSpace, {
      props: { wrapItem: false },
      slots: { default: '<span class="a">A</span><span class="b">B</span>' },
    })
    expect(wrapper.findAll('.m-space__item')).toHaveLength(0)
    expect(wrapper.findAll('.a, .b')).toHaveLength(2)
  })

  it('supports vertical layout', () => {
    const wrapper = mount(MSpace, {
      props: { vertical: true, size: [8, 16] },
      slots: { default: '<span>A</span>' },
    })
    expect(wrapper.element.style.flexDirection).toBe('column')
    expect(wrapper.element.style.gap).toBe('16px 8px')
  })

  it('defaults gap to the medium token', () => {
    const wrapper = mount(MSpace, {
      slots: { default: '<span>A</span>' },
    })
    expect(wrapper.element.style.gap).toBe('var(--m-space-3)')
  })

  it('accepts CSS length strings for size', () => {
    const rem = mount(MSpace, {
      props: { size: '1rem' },
      slots: { default: '<span>A</span>' },
    })
    expect(rem.element.style.gap).toBe('1rem')

    const tokenVar = mount(MSpace, {
      props: { size: 'var(--m-space-4)' },
      slots: { default: '<span>A</span>' },
    })
    expect(tokenVar.element.style.gap).toBe('var(--m-space-4)')

    const numericString = mount(MSpace, {
      props: { size: '12' },
      slots: { default: '<span>A</span>' },
    })
    expect(numericString.element.style.gap).toBe('12px')
  })
})
