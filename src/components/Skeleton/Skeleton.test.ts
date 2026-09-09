import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MSkeleton from './Skeleton.vue'

describe('muSkeleton', () => {
  it('renders rectangle wave skeleton by default', () => {
    const wrapper = mount(MSkeleton)
    expect(wrapper.classes()).toContain('m-skeleton')
    expect(wrapper.classes()).toContain('m-skeleton--wave')
    expect(wrapper.classes()).not.toContain('m-skeleton--circle')
    expect(wrapper.attributes('style')).toContain('width: 100%')
  })

  it('applies circle shape and custom size', () => {
    const wrapper = mount(MSkeleton, {
      props: { shape: 'circle', width: '3rem', height: '3rem', animation: 'none' },
    })
    expect(wrapper.classes()).toContain('m-skeleton--circle')
    expect(wrapper.classes()).not.toContain('m-skeleton--wave')
    expect(wrapper.attributes('style')).toContain('width: 3rem')
    expect(wrapper.attributes('style')).toContain('height: 3rem')
  })

  it('applies borderRadius when provided', () => {
    const wrapper = mount(MSkeleton, { props: { borderRadius: '8px', height: '1rem' } })
    expect(wrapper.attributes('style')).toContain('border-radius: 8px')
  })

  it('repeats text placeholders', () => {
    const wrapper = mount(MSkeleton, { props: { text: true, repeat: 3 } })
    expect(wrapper.classes()).toContain('m-skeleton-repeat')
    expect(wrapper.findAll('.m-skeleton--text')).toHaveLength(3)
  })
})
