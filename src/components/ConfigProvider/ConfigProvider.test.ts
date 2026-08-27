import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { createWellInsight, useWiConfig } from '../../shared/config'
import WiInput from '../Input/Input.vue'
import WiSpace from '../Space/Space.vue'
import WiConfigProvider from './ConfigProvider.vue'

describe('wiConfigProvider', () => {
  it('provides merged global config to descendants', () => {
    const Probe = defineComponent({
      setup() {
        const config = useWiConfig()
        return () => h('span', { 'data-append': String(config.value.appendTo) }, config.value.locale?.accept)
      },
    })

    const wrapper = mount(WiConfigProvider, {
      props: {
        appendTo: 'body',
        locale: { accept: 'OK' },
      },
      slots: { default: () => h(Probe) },
    })

    expect(wrapper.get('span').attributes('data-append')).toBe('body')
    expect(wrapper.text()).toContain('OK')
  })

  it('applies global size and inputVariant to Input', () => {
    const wrapper = mount(WiConfigProvider, {
      props: {
        size: 'small',
        inputVariant: 'filled',
      },
      slots: {
        default: () => h(WiInput, { modelValue: 'hi', 'onUpdate:modelValue': () => undefined }),
      },
    })

    const input = wrapper.get('.wi-input')
    expect(input.classes()).toContain('wi-input--small')
    expect(input.classes()).toContain('wi-input--filled')
  })

  it('exposes density on the provider root', () => {
    const wrapper = mount(WiConfigProvider, {
      props: { density: 'compact', globalDensity: false },
      slots: { default: () => h('span', 'x') },
    })
    expect(wrapper.get('.wi-config-provider').attributes('data-wi-density')).toBe('compact')
  })

  it('writes overlay z-index base as a CSS variable', () => {
    const wrapper = mount(WiConfigProvider, {
      props: { zIndex: 2200, globalDensity: false },
      slots: { default: () => h('span', 'x') },
    })
    const style = wrapper.get('.wi-config-provider').attributes('style') ?? ''
    expect(style).toContain('--wi-z-base: 2200')
  })

  it('applies per-component defaults without changing global size for other components', () => {
    const wrapper = mount(WiConfigProvider, {
      props: {
        size: 'large',
        componentDefaults: {
          Input: { size: 'small', variant: 'filled', clearable: true },
        },
      },
      slots: {
        default: () => h(WiInput, { modelValue: 'draft', 'onUpdate:modelValue': () => undefined }),
      },
    })

    const input = wrapper.get('.wi-input')
    expect(input.classes()).toContain('wi-input--small')
    expect(input.classes()).toContain('wi-input--filled')
    expect(wrapper.get('.wi-input__clear').exists()).toBe(true)
  })

  it('lets local props override componentDefaults', () => {
    const wrapper = mount(WiConfigProvider, {
      props: {
        componentDefaults: { Input: { size: 'small' } },
      },
      slots: {
        default: () =>
          h(WiInput, { modelValue: '', size: 'large', 'onUpdate:modelValue': () => undefined }),
      },
    })
    expect(wrapper.get('.wi-input').classes()).toContain('wi-input--large')
  })

  it('inherits parent config in nested providers', () => {
    const Probe = defineComponent({
      setup() {
        const config = useWiConfig()
        return () =>
          h('span', {
            'data-append': String(config.value.appendTo),
            'data-size': String(config.value.size),
            'data-density': String(config.value.density),
          })
      },
    })

    const wrapper = mount(WiConfigProvider, {
      props: { appendTo: 'body', size: 'small' },
      slots: {
        default: () =>
          h(
            WiConfigProvider,
            { density: 'compact', globalDensity: false },
            { default: () => h(Probe) },
          ),
      },
    })

    const probe = wrapper.get('span')
    expect(probe.attributes('data-append')).toBe('body')
    expect(probe.attributes('data-size')).toBe('small')
    expect(probe.attributes('data-density')).toBe('compact')
  })

  it('applies Space gap from componentDefaults', () => {
    const wrapper = mount(WiConfigProvider, {
      props: {
        componentDefaults: { Space: { size: 24 } },
      },
      slots: {
        default: () => h(WiSpace, null, { default: () => [h('span', 'A'), h('span', 'B')] }),
      },
    })
    expect(wrapper.get('.wi-space').element.style.gap).toBe('24px')
  })

  it('inherits plugin defaults when the provider only sets a subset', () => {
    const wrapper = mount(WiConfigProvider, {
      props: { density: 'compact', globalDensity: false },
      global: {
        plugins: [createWellInsight({ size: 'small', components: false })],
      },
      slots: {
        default: () => h(WiInput, { modelValue: '', 'onUpdate:modelValue': () => undefined }),
      },
    })
    expect(wrapper.get('.wi-input').classes()).toContain('wi-input--small')
    expect(wrapper.get('.wi-config-provider').attributes('data-wi-density')).toBe('compact')
  })
})
