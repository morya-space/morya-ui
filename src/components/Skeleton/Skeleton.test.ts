import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiSkeleton from './Skeleton.vue'

describe('WiSkeleton', () => {
  it('renders rectangle wave skeleton by default', () => {
    const wrapper = mount(WiSkeleton)
    expect(wrapper.classes()).toContain('wi-skeleton')
    expect(wrapper.classes()).toContain('wi-skeleton--wave')
    expect(wrapper.classes()).not.toContain('wi-skeleton--circle')
    expect(wrapper.attributes('style')).toContain('width: 100%')
  })

  it('applies circle shape and custom size', () => {
    const wrapper = mount(WiSkeleton, {
      props: { shape: 'circle', width: '3rem', height: '3rem', animation: 'none' },
    })
    expect(wrapper.classes()).toContain('wi-skeleton--circle')
    expect(wrapper.classes()).not.toContain('wi-skeleton--wave')
    expect(wrapper.attributes('style')).toContain('width: 3rem')
    expect(wrapper.attributes('style')).toContain('height: 3rem')
  })

  it('applies borderRadius when provided', () => {
    const wrapper = mount(WiSkeleton, { props: { borderRadius: '8px', height: '1rem' } })
    expect(wrapper.attributes('style')).toContain('border-radius: 8px')
  })

  it('repeats text placeholders', () => {
    const wrapper = mount(WiSkeleton, { props: { text: true, repeat: 3 } })
    expect(wrapper.classes()).toContain('wi-skeleton-repeat')
    expect(wrapper.findAll('.wi-skeleton--text')).toHaveLength(3)
  })
})
