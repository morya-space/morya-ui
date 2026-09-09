import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import MLayoutSider from './LayoutSider.vue'

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
})
