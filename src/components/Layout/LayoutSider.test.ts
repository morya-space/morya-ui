import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import RdLayoutSider from './LayoutSider.vue'

describe('LayoutSider', () => {
  it('toggles collapsed via trigger in transform mode', async () => {
    const wrapper = mount(RdLayoutSider, {
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
    await wrapper.get('.rd-layout-sider__trigger').trigger('click')
    await nextTick()
    expect(wrapper.classes()).toContain('rd-layout-sider--collapsed')
    expect(wrapper.element.style.maxWidth).toBe('52px')
  })

  it('applies inverted and bordered modifiers', () => {
    const wrapper = mount(RdLayoutSider, {
      props: { inverted: true, bordered: true },
    })
    expect(wrapper.classes()).toContain('rd-layout-sider--inverted')
    expect(wrapper.classes()).toContain('rd-layout-sider--bordered')
  })
})
