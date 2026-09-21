import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { getIconCategoryGroups } from './icon-categories'
import MIcon from './Icon.vue'
import { iconNames, isIconName } from './icons'

describe('muIcon', () => {
  it('hides decorative icons and labels informative ones', () => {
    const decorative = mount(MIcon, { props: { name: 'search' } })
    const informative = mount(MIcon, { props: { name: 'trash', label: '删除项目' } })
    expect(decorative.attributes('aria-hidden')).toBe('true')
    expect(informative.attributes('aria-label')).toBe('删除项目')
    expect(informative.find('svg').exists()).toBe(true)
  })

  it('maps size aliases to small/normal/large classes', () => {
    expect(mount(MIcon, { props: { name: 'check', size: 'sm' } }).classes()).toContain('m-icon--small')
    expect(mount(MIcon, { props: { name: 'check', size: 'large' } }).classes()).toContain('m-icon--large')
    expect(mount(MIcon, { props: { name: 'check', size: 'md' } }).classes()).toContain('m-icon--normal')
  })

  it('exposes a registry of system icons', () => {
    expect(iconNames.length).toBeGreaterThan(20)
    expect(isIconName('loader')).toBe(true)
    expect(isIconName('not-a-real-icon')).toBe(false)
    expect(mount(MIcon, { props: { name: 'loader' } }).classes()).toContain('m-icon--spin')
  })

  it('includes common Tabler-sourced icons used by Menu and Layout', () => {
    for (const name of [
      'layout-dashboard',
      'users',
      'folder',
      'file-text',
      'save',
      'layers',
      'play',
      'info-circle',
    ] as const) {
      expect(isIconName(name)).toBe(true)
      const wrapper = mount(MIcon, { props: { name } })
      expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 24 24')
    }
    expect(iconNames.length).toBeGreaterThan(100)
  })

  it('groups every registry icon into a category', () => {
    const groups = getIconCategoryGroups()
    const covered = new Set(groups.flatMap((group) => group.icons))
    expect(covered.size).toBe(iconNames.length)
    expect(groups.length).toBeGreaterThan(5)
  })

  it('prefers the default slot over name for custom icons', () => {
    const wrapper = mount(MIcon, {
      props: { name: 'search', label: '用户' },
      slots: {
        default: () => h('svg', { 'data-custom': '1', viewBox: '0 0 16 16' }, []),
      },
    })
    expect(wrapper.find('[data-custom="1"]').exists()).toBe(true)
    expect(wrapper.find('svg[viewBox="0 0 16 16"]').attributes('data-custom')).toBe('1')
  })
})
