import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdSkeleton from './Skeleton.vue'

describe('rdSkeleton', () => {
  it('renders rectangle wave skeleton by default', () => {
    const wrapper = mount(RdSkeleton)
    expect(wrapper.classes()).toContain('rd-skeleton')
    expect(wrapper.classes()).toContain('rd-skeleton--wave')
    expect(wrapper.classes()).not.toContain('rd-skeleton--circle')
    expect(wrapper.attributes('style')).toContain('width: 100%')
  })

  it('applies circle shape and custom size', () => {
    const wrapper = mount(RdSkeleton, {
      props: { shape: 'circle', width: '3rem', height: '3rem', animation: 'none' },
    })
    expect(wrapper.classes()).toContain('rd-skeleton--circle')
    expect(wrapper.classes()).not.toContain('rd-skeleton--wave')
    expect(wrapper.attributes('style')).toContain('width: 3rem')
    expect(wrapper.attributes('style')).toContain('height: 3rem')
  })

  it('applies borderRadius when provided', () => {
    const wrapper = mount(RdSkeleton, { props: { borderRadius: '8px', height: '1rem' } })
    expect(wrapper.attributes('style')).toContain('border-radius: 8px')
  })

  it('repeats text placeholders', () => {
    const wrapper = mount(RdSkeleton, { props: { text: true, repeat: 3 } })
    expect(wrapper.classes()).toContain('rd-skeleton-repeat')
    expect(wrapper.findAll('.rd-skeleton--text')).toHaveLength(3)
  })
})
