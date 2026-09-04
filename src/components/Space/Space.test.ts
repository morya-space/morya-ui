import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdSpace from './Space.vue'

describe('wdSpace', () => {
  it('wraps children by default', () => {
    const wrapper = mount(WdSpace, {
      slots: { default: '<span class="a">A</span><span class="b">B</span>' },
    })
    expect(wrapper.classes()).toContain('wd-space')
    expect(wrapper.findAll('.wd-space__item')).toHaveLength(2)
    expect(wrapper.find('.a').exists()).toBe(true)
  })

  it('can skip item wrapping', () => {
    const wrapper = mount(WdSpace, {
      props: { wrapItem: false },
      slots: { default: '<span class="a">A</span><span class="b">B</span>' },
    })
    expect(wrapper.findAll('.wd-space__item')).toHaveLength(0)
    expect(wrapper.findAll('.a, .b')).toHaveLength(2)
  })

  it('supports vertical layout', () => {
    const wrapper = mount(WdSpace, {
      props: { vertical: true, size: [8, 16] },
      slots: { default: '<span>A</span>' },
    })
    expect(wrapper.element.style.flexDirection).toBe('column')
    expect(wrapper.element.style.gap).toBe('16px 8px')
  })

  it('defaults gap to the medium token', () => {
    const wrapper = mount(WdSpace, {
      slots: { default: '<span>A</span>' },
    })
    expect(wrapper.element.style.gap).toBe('var(--wd-space-3)')
  })
})
