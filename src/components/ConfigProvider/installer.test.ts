import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mComponents } from '../../component-registry'
import { createMoryaUI, MoryaUI } from '../../shared/config'
import MButton from '../Button/Button.vue'

describe('createMoryaUI / MoryaUI installer', () => {
  it('registers all components globally by default', () => {
    const Host = defineComponent({
      template: '<MButton label="Go" />',
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [createMoryaUI()],
      },
    })

    expect(wrapper.get('button').text()).toContain('Go')
    expect(Object.keys(mComponents).length).toBeGreaterThan(50)
  })

  it('accepts options via app.use(MoryaUI, options)', () => {
    const Host = defineComponent({
      template: '<MButton label="Sized" />',
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [[MoryaUI, { size: 'small' }]],
      },
    })

    expect(wrapper.get('.m-button').classes()).toContain('m-button--small')
  })

  it('skips component registration when components is false', () => {
    const Host = defineComponent({
      setup() {
        return () => h('div', 'ok')
      },
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [createMoryaUI({ components: false, size: 'large' })],
      },
    })

    expect(wrapper.vm.$.appContext.components.MButton).toBeUndefined()
    expect(wrapper.vm.$.appContext.config.globalProperties.$m?.size).toBe('large')
  })

  it('registers a partial component list', () => {
    const Host = defineComponent({
      template: '<MButton label="Only" />',
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [createMoryaUI({ components: [MButton] })],
      },
    })

    expect(wrapper.get('button').text()).toContain('Only')
    expect(wrapper.vm.$.appContext.components.MInput).toBeUndefined()
  })
})
