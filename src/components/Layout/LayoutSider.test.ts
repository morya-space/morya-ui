import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import MLayoutSider from './LayoutSider.vue'

const siderStyles = readFileSync(resolve(import.meta.dirname, './styles.css'), 'utf8')

describe('LayoutSider', () => {
  it('toggles collapsed via trigger in transform mode', async () => {
    const wrapper = mount(MLayoutSider, {
      props: {
        showTrigger: 'arrow-circle',
        width: 220,
        collapsedWidth: 52,
        collapsed: false,
        'onUpdate:collapsed': (value: boolean) => {
          void wrapper.setProps({ collapsed: value })
        },
      },
      slots: { default: 'Nav' },
    })
    await wrapper.get('.m-layout-sider__trigger').trigger('click')
    await nextTick()
    expect(wrapper.classes()).toContain('m-layout-sider--collapsed')
    expect(wrapper.element.style.maxWidth).toBe('52px')
  })

  it('applies inverted and bordered modifiers', () => {
    const wrapper = mount(MLayoutSider, {
      props: { inverted: true, bordered: true },
    })
    expect(wrapper.classes()).toContain('m-layout-sider--inverted')
    expect(wrapper.classes()).toContain('m-layout-sider--bordered')
  })

  it('nests menu wrap inside sider scrollbar when expanded', () => {
    const wrapper = mount(MLayoutSider, {
      props: { collapsed: false, showCollapsedContent: true },
      slots: { default: '<nav class="demo-nav">Nav</nav>' },
    })

    expect(wrapper.classes()).toContain('m-layout-sider--show-content')
    const scrollbar = wrapper.get('.m-layout-sider__scrollbar')
    const scroll = scrollbar.get('.m-layout-sider__scroll')
    expect(scroll.exists()).toBe(true)
    expect(scroll.get('.demo-nav').text()).toBe('Nav')
  })

  it('applies collapse opacity only on scrollbar root, not the inner wrap', () => {
    expect(siderStyles).toMatch(
      /\.m-layout-sider__scrollbar\s*\{[^}]*opacity:\s*0/s,
    )
    expect(siderStyles).toMatch(
      /\.m-layout-sider--show-content\s*>\s*\.m-layout-sider__scrollbar\s*\{[^}]*opacity:\s*1/s,
    )
    expect(siderStyles).not.toMatch(
      /\.m-layout-sider__scroll,\s*\n\s*\.m-layout-sider__scrollbar\s*\{[^}]*opacity:\s*0/s,
    )
  })
})
