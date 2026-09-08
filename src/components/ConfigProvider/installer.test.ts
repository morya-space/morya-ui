import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { wkComponents } from '../../component-registry'
import { createWiseKit, WiseKit } from '../../shared/config'
import WkButton from '../Button/Button.vue'

describe('createWiseKit / WiseKit installer', () => {
  it('registers all components globally by default', () => {
    const Host = defineComponent({
      template: '<WkButton label="Go" />',
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [createWiseKit()],
      },
    })

    expect(wrapper.get('button').text()).toContain('Go')
    expect(Object.keys(wkComponents).length).toBeGreaterThan(50)
  })

  it('accepts options via app.use(WiseKit, options)', () => {
    const Host = defineComponent({
      template: '<WkButton label="Sized" />',
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [[WiseKit, { size: 'small' }]],
      },
    })

    expect(wrapper.get('.wk-button').classes()).toContain('wk-button--small')
  })

  it('skips component registration when components is false', () => {
    const Host = defineComponent({
      setup() {
        return () => h('div', 'ok')
      },
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [createWiseKit({ components: false, size: 'large' })],
      },
    })

    expect(wrapper.vm.$.appContext.components.WkButton).toBeUndefined()
    expect(wrapper.vm.$.appContext.config.globalProperties.$wk?.size).toBe('large')
  })

  it('registers a partial component list', () => {
    const Host = defineComponent({
      template: '<WkButton label="Only" />',
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [createWiseKit({ components: [WkButton] })],
      },
    })

    expect(wrapper.get('button').text()).toContain('Only')
    expect(wrapper.vm.$.appContext.components.WkInput).toBeUndefined()
  })
})
