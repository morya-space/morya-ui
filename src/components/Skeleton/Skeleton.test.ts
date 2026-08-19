import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdSkeleton from './Skeleton.vue'

describe('WdSkeleton', () => {
  it('renders rectangle wave skeleton by default', () => {
    const wrapper = mount(WdSkeleton)
    expect(wrapper.classes()).toContain('wd-skeleton')
    expect(wrapper.classes()).toContain('wd-skeleton--wave')
    expect(wrapper.classes()).not.toContain('wd-skeleton--circle')
    expect(wrapper.attributes('style')).toContain('width: 100%')
  })

  it('applies circle shape and custom size', () => {
    const wrapper = mount(WdSkeleton, {
      props: { shape: 'circle', width: '3rem', height: '3rem', animation: 'none' },
    })
    expect(wrapper.classes()).toContain('wd-skeleton--circle')
    expect(wrapper.classes()).not.toContain('wd-skeleton--wave')
    expect(wrapper.attributes('style')).toContain('width: 3rem')
    expect(wrapper.attributes('style')).toContain('height: 3rem')
  })

  it('applies borderRadius when provided', () => {
    const wrapper = mount(WdSkeleton, { props: { borderRadius: '8px', height: '1rem' } })
    expect(wrapper.attributes('style')).toContain('border-radius: 8px')
  })
})
