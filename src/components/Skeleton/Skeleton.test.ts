import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkSkeleton from './Skeleton.vue'

describe('wkSkeleton', () => {
  it('renders rectangle wave skeleton by default', () => {
    const wrapper = mount(WkSkeleton)
    expect(wrapper.classes()).toContain('wk-skeleton')
    expect(wrapper.classes()).toContain('wk-skeleton--wave')
    expect(wrapper.classes()).not.toContain('wk-skeleton--circle')
    expect(wrapper.attributes('style')).toContain('width: 100%')
  })

  it('applies circle shape and custom size', () => {
    const wrapper = mount(WkSkeleton, {
      props: { shape: 'circle', width: '3rem', height: '3rem', animation: 'none' },
    })
    expect(wrapper.classes()).toContain('wk-skeleton--circle')
    expect(wrapper.classes()).not.toContain('wk-skeleton--wave')
    expect(wrapper.attributes('style')).toContain('width: 3rem')
    expect(wrapper.attributes('style')).toContain('height: 3rem')
  })

  it('applies borderRadius when provided', () => {
    const wrapper = mount(WkSkeleton, { props: { borderRadius: '8px', height: '1rem' } })
    expect(wrapper.attributes('style')).toContain('border-radius: 8px')
  })

  it('repeats text placeholders', () => {
    const wrapper = mount(WkSkeleton, { props: { text: true, repeat: 3 } })
    expect(wrapper.classes()).toContain('wk-skeleton-repeat')
    expect(wrapper.findAll('.wk-skeleton--text')).toHaveLength(3)
  })
})
