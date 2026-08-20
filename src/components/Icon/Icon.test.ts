import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WiIcon from './Icon.vue'
import { iconNames, isIconName } from './icons'

describe('WiIcon', () => {
  it('hides decorative icons and labels informative ones', () => {
    const decorative = mount(WiIcon, { props: { name: 'search' } })
    const informative = mount(WiIcon, { props: { name: 'trash', label: '删除项目' } })
    expect(decorative.attributes('aria-hidden')).toBe('true')
    expect(informative.attributes('aria-label')).toBe('删除项目')
    expect(informative.find('svg').exists()).toBe(true)
  })

  it('maps size aliases to small/normal/large classes', () => {
    expect(mount(WiIcon, { props: { name: 'check', size: 'sm' } }).classes()).toContain('wi-icon--small')
    expect(mount(WiIcon, { props: { name: 'check', size: 'large' } }).classes()).toContain('wi-icon--large')
    expect(mount(WiIcon, { props: { name: 'check', size: 'md' } }).classes()).toContain('wi-icon--normal')
  })

  it('exposes a registry of system icons', () => {
    expect(iconNames.length).toBeGreaterThan(20)
    expect(isIconName('loader')).toBe(true)
    expect(isIconName('not-a-real-icon')).toBe(false)
    expect(mount(WiIcon, { props: { name: 'loader' } }).classes()).toContain('wi-icon--spin')
  })

  it('prefers the default slot over name for custom icons', () => {
    const wrapper = mount(WiIcon, {
      props: { name: 'search', label: '用户' },
      slots: {
        default: () => h('svg', { 'data-custom': '1', viewBox: '0 0 16 16' }, []),
      },
    })
    expect(wrapper.find('[data-custom="1"]').exists()).toBe(true)
    expect(wrapper.find('svg[viewBox="0 0 16 16"]').attributes('data-custom')).toBe('1')
  })
})
