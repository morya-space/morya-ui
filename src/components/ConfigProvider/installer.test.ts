import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { rdComponents } from '../../component-registry'
import { createRoostDesign, RoostDesign } from '../../shared/config'
import RdButton from '../Button/Button.vue'

describe('createRoostDesign / RoostDesign installer', () => {
  it('registers all components globally by default', () => {
    const Host = defineComponent({
      template: '<RdButton label="Go" />',
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [createRoostDesign()],
      },
    })

    expect(wrapper.get('button').text()).toContain('Go')
    expect(Object.keys(rdComponents).length).toBeGreaterThan(50)
  })

  it('accepts options via app.use(RoostDesign, options)', () => {
    const Host = defineComponent({
      template: '<RdButton label="Sized" />',
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [[RoostDesign, { size: 'small' }]],
      },
    })

    expect(wrapper.get('.rd-button').classes()).toContain('rd-button--small')
  })

  it('skips component registration when components is false', () => {
    const Host = defineComponent({
      setup() {
        return () => h('div', 'ok')
      },
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [createRoostDesign({ components: false, size: 'large' })],
      },
    })

    expect(wrapper.vm.$.appContext.components.RdButton).toBeUndefined()
    expect(wrapper.vm.$.appContext.config.globalProperties.$rd?.size).toBe('large')
  })

  it('registers a partial component list', () => {
    const Host = defineComponent({
      template: '<RdButton label="Only" />',
    })

    const wrapper = mount(Host, {
      global: {
        plugins: [createRoostDesign({ components: [RdButton] })],
      },
    })

    expect(wrapper.get('button').text()).toContain('Only')
    expect(wrapper.vm.$.appContext.components.RdInput).toBeUndefined()
  })
})
