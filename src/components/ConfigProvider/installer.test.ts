import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { wiComponents } from '../../component-registry'
import { createWellInsight, WellInsight } from '../../shared/config'
import WiButton from '../Button/Button.vue'

describe('createWellInsight / WellInsight installer', () => {
  it('registers all components globally by default', () => {
    const Host = defineComponent({
      template: '<WiButton label="Go" />',
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [createWellInsight()],
      },
    })

    expect(wrapper.get('button').text()).toContain('Go')
    expect(Object.keys(wiComponents).length).toBeGreaterThan(50)
  })

  it('accepts options via app.use(WellInsight, options)', () => {
    const Host = defineComponent({
      template: '<WiButton label="Sized" />',
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [[WellInsight, { size: 'small' }]],
      },
    })

    expect(wrapper.get('.wi-button').classes()).toContain('wi-button--small')
  })

  it('skips component registration when components is false', () => {
    const Host = defineComponent({
      setup() {
        return () => h('div', 'ok')
      },
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [createWellInsight({ components: false, size: 'large' })],
      },
    })

    expect(wrapper.vm.$.appContext.components.WiButton).toBeUndefined()
    expect(wrapper.vm.$.appContext.config.globalProperties.$wi?.size).toBe('large')
  })

  it('registers a partial component list', () => {
    const Host = defineComponent({
      template: '<WiButton label="Only" />',
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [createWellInsight({ components: [WiButton] })],
      },
    })

    expect(wrapper.get('button').text()).toContain('Only')
    expect(wrapper.vm.$.appContext.components.WiInput).toBeUndefined()
  })
})
