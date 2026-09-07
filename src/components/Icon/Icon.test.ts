import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import RdIcon from './Icon.vue'
import { iconNames, isIconName } from './icons'

describe('rdIcon', () => {
  it('hides decorative icons and labels informative ones', () => {
    const decorative = mount(RdIcon, { props: { name: 'search' } })
    const informative = mount(RdIcon, { props: { name: 'trash', label: '删除项目' } })
    expect(decorative.attributes('aria-hidden')).toBe('true')
    expect(informative.attributes('aria-label')).toBe('删除项目')
    expect(informative.find('svg').exists()).toBe(true)
  })

  it('maps size aliases to small/normal/large classes', () => {
    expect(mount(RdIcon, { props: { name: 'check', size: 'sm' } }).classes()).toContain('rd-icon--small')
    expect(mount(RdIcon, { props: { name: 'check', size: 'large' } }).classes()).toContain('rd-icon--large')
    expect(mount(RdIcon, { props: { name: 'check', size: 'md' } }).classes()).toContain('rd-icon--normal')
  })

  it('exposes a registry of system icons', () => {
    expect(iconNames.length).toBeGreaterThan(20)
    expect(isIconName('loader')).toBe(true)
    expect(isIconName('not-a-real-icon')).toBe(false)
    expect(mount(RdIcon, { props: { name: 'loader' } }).classes()).toContain('rd-icon--spin')
  })

  it('prefers the default slot over name for custom icons', () => {
    const wrapper = mount(RdIcon, {
      props: { name: 'search', label: '用户' },
      slots: {
        default: () => h('svg', { 'data-custom': '1', viewBox: '0 0 16 16' }, []),
      },
    })
    expect(wrapper.find('[data-custom="1"]').exists()).toBe(true)
    expect(wrapper.find('svg[viewBox="0 0 16 16"]').attributes('data-custom')).toBe('1')
  })
})
