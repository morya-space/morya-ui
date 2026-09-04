import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { wdComponents } from '../../component-registry'
import { createWexDesign, WexDesign } from '../../shared/config'
import WdButton from '../Button/Button.vue'

describe('createWexDesign / WexDesign installer', () => {
  it('registers all components globally by default', () => {
    const Host = defineComponent({
      template: '<WdButton label="Go" />',
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [createWexDesign()],
      },
    })

    expect(wrapper.get('button').text()).toContain('Go')
    expect(Object.keys(wdComponents).length).toBeGreaterThan(50)
  })

  it('accepts options via app.use(WexDesign, options)', () => {
    const Host = defineComponent({
      template: '<WdButton label="Sized" />',
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [[WexDesign, { size: 'small' }]],
      },
    })

    expect(wrapper.get('.wd-button').classes()).toContain('wd-button--small')
  })

  it('skips component registration when components is false', () => {
    const Host = defineComponent({
      setup() {
        return () => h('div', 'ok')
      },
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [createWexDesign({ components: false, size: 'large' })],
      },
    })

    expect(wrapper.vm.$.appContext.components.WdButton).toBeUndefined()
    expect(wrapper.vm.$.appContext.config.globalProperties.$wd?.size).toBe('large')
  })

  it('registers a partial component list', () => {
    const Host = defineComponent({
      template: '<WdButton label="Only" />',
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [createWexDesign({ components: [WdButton] })],
      },
    })

    expect(wrapper.get('button').text()).toContain('Only')
    expect(wrapper.vm.$.appContext.components.WdInput).toBeUndefined()
  })
})
