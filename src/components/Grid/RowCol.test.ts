import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import MCol from './Col.vue'
import MRow from './Row.vue'
import { mergeColResponsive, resolveGutter, resolveGutterValue } from './rowColTypes'

describe('MRow', () => {
  it('applies justify, align, and wrap modifiers', () => {
    const wrapper = mount(MRow, {
      props: { justify: 'space-between', align: 'middle', wrap: false },
    })

    expect(wrapper.classes()).toContain('m-row')
    expect(wrapper.classes()).toContain('m-row--justify-space-between')
    expect(wrapper.classes()).toContain('m-row--align-middle')
    expect(wrapper.classes()).toContain('m-row--nowrap')
  })

  it('cancels the column padding with negative margins', () => {
    const wrapper = mount(MRow, { props: { gutter: 16 } })
    const style = wrapper.attributes('style') ?? ''

    expect(style).toContain('margin-inline-start: -8px')
    expect(style).toContain('margin-inline-end: -8px')
  })

  it('applies the vertical gutter as row-gap', () => {
    const wrapper = mount(MRow, { props: { gutter: [16, 24] } })
    expect(wrapper.attributes('style')).toContain('row-gap: 24px')
  })

  it('renders a custom tag', () => {
    const wrapper = mount(MRow, { props: { component: 'section' } })
    expect(wrapper.element.tagName).toBe('SECTION')
  })
})

describe('MCol', () => {
  it('defaults to a full-width column', () => {
    const wrapper = mount(MCol)
    const style = wrapper.attributes('style') ?? ''

    expect(wrapper.classes()).toContain('m-col')
    expect(style).toContain('max-width: 100%')
    expect(style).toContain('flex-basis: 100%')
    expect(style).toContain('flex-grow: 0')
    expect(style).toContain('flex-shrink: 0')
  })

  it('converts span into a 24-column percentage', () => {
    const wrapper = mount(MCol, { props: { span: 6 } })
    const style = wrapper.attributes('style') ?? ''

    expect(style).toContain('flex-basis: 25%')
    expect(style).toContain('max-width: 25%')
  })

  it('maps offset, push, and pull to logical properties', () => {
    const wrapper = mount(MCol, { props: { span: 12, offset: 6, push: 3, pull: 3 } })
    const style = wrapper.attributes('style') ?? ''

    expect(style).toContain('margin-inline-start: 25%')
    expect(style).toContain('inset-inline-start: 12.5%')
    expect(style).toContain('inset-inline-end: 12.5%')
    expect(style).toContain('position: relative')
  })

  it('applies order and flex', () => {
    const wrapper = mount(MCol, { props: { span: 12, order: 2, flex: '1 1 auto' } })
    const style = wrapper.attributes('style') ?? ''

    expect(style).toContain('order: 2')
    // `flex` wins over `span`.
    expect(style).toContain('flex-grow: 1')
    expect(style).toContain('flex-basis: auto')
    expect(style).not.toContain('max-width')
  })

  it('takes half the row gutter as horizontal padding', () => {
    const Host = {
      render: () => h(MRow, { gutter: 20 }, { default: () => h(MCol, { span: 12 }) }),
    }
    const wrapper = mount(Host)
    const style = wrapper.get('.m-col').attributes('style') ?? ''

    expect(style).toContain('padding-inline-start: 10px')
    expect(style).toContain('padding-inline-end: 10px')
  })

  it('applies the always-satisfied xs override', () => {
    const wrapper = mount(MCol, { props: { span: 24, xs: 12 } })
    const style = wrapper.attributes('style') ?? ''

    expect(style).toContain('flex-basis: 50%')
  })

  it('supports an object form for an override', () => {
    const wrapper = mount(MCol, { props: { span: 24, xs: { span: 12, offset: 6 } } })
    const style = wrapper.attributes('style') ?? ''

    expect(style).toContain('flex-basis: 50%')
    expect(style).toContain('margin-inline-start: 25%')
  })
})

describe('grid helpers', () => {
  it('mergeColResponsive folds a number into span', () => {
    expect(mergeColResponsive({ span: 24, offset: 0 }, 8)).toEqual({ span: 8, offset: 0 })
  })

  it('mergeColResponsive merges an object', () => {
    expect(mergeColResponsive({ span: 24 }, { span: 12, order: 1 })).toEqual({ span: 12, order: 1 })
  })

  it('resolveGutterValue picks the largest satisfied breakpoint', () => {
    expect(resolveGutterValue({ xs: 8, md: 16, xl: 24 }, ['xs', 'md'])).toBe(16)
    expect(resolveGutterValue({ xs: 8, md: 16 }, ['xs'])).toBe(8)
    expect(resolveGutterValue(12, ['xs'])).toBe(12)
    expect(resolveGutterValue(undefined, ['xs'])).toBe(0)
  })

  it('resolveGutter normalizes every supported form', () => {
    expect(resolveGutter(16, ['xs'])).toEqual([16, 0])
    expect(resolveGutter([16, 24], ['xs'])).toEqual([16, 24])
    expect(resolveGutter({ xs: 8, lg: 32 }, ['xs', 'lg'])).toEqual([32, 0])
    expect(resolveGutter(undefined, ['xs'])).toEqual([0, 0])
  })
})
