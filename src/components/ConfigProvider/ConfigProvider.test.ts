import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { createWiseKit, useWkConfig } from '../../shared/config'
import { applyTheme } from '../../theme'
import WkInput from '../Input/Input.vue'
import WkSpace from '../Space/Space.vue'
import WkConfigProvider from './ConfigProvider.vue'

describe('wkConfigProvider', () => {
  it('provides merged global config to descendants', () => {
    const Probe = defineComponent({
      setup() {
        const config = useWkConfig()
        return () => h('span', { 'data-append': String(config.value.appendTo) }, config.value.locale?.accept)
      },
    })

    const wrapper = mount(WkConfigProvider, {
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
    const wrapper = mount(WkConfigProvider, {
      props: {
        size: 'small',
        inputVariant: 'filled',
      },
      slots: {
        default: () => h(WkInput, { modelValue: 'hi', 'onUpdate:modelValue': () => undefined }),
      },
    })

    const input = wrapper.get('.wk-input')
    expect(input.classes()).toContain('wk-input--small')
    expect(input.classes()).toContain('wk-input--filled')
  })

  it('exposes density on the provider root', () => {
    const wrapper = mount(WkConfigProvider, {
      props: { density: 'compact', globalDensity: false },
      slots: { default: () => h('span', 'x') },
    })
    expect(wrapper.get('.wk-config-provider').attributes('data-wk-density')).toBe('compact')
  })

  it('writes overlay z-index base as a CSS variable', () => {
    const wrapper = mount(WkConfigProvider, {
      props: { zIndex: 2200, globalDensity: false },
      slots: { default: () => h('span', 'x') },
    })
    const style = wrapper.get('.wk-config-provider').attributes('style') ?? ''
    expect(style).toContain('--wk-z-base: 2200')
  })

  it('applies per-component defaults without changing global size for other components', () => {
    const wrapper = mount(WkConfigProvider, {
      props: {
        size: 'large',
        componentDefaults: {
          Input: { size: 'small', variant: 'filled', clearable: true },
        },
      },
      slots: {
        default: () => h(WkInput, { modelValue: 'draft', 'onUpdate:modelValue': () => undefined }),
      },
    })

    const input = wrapper.get('.wk-input')
    expect(input.classes()).toContain('wk-input--small')
    expect(input.classes()).toContain('wk-input--filled')
    expect(wrapper.get('.wk-input__clear').exists()).toBe(true)
  })

  it('lets local props override componentDefaults', () => {
    const wrapper = mount(WkConfigProvider, {
      props: {
        componentDefaults: { Input: { size: 'small' } },
      },
      slots: {
        default: () =>
          h(WkInput, { modelValue: '', size: 'large', 'onUpdate:modelValue': () => undefined }),
      },
    })
    expect(wrapper.get('.wk-input').classes()).toContain('wk-input--large')
  })

  it('inherits parent config in nested providers', () => {
    const Probe = defineComponent({
      setup() {
        const config = useWkConfig()
        return () =>
          h('span', {
            'data-append': String(config.value.appendTo),
            'data-size': String(config.value.size),
            'data-density': String(config.value.density),
          })
      },
    })

    const wrapper = mount(WkConfigProvider, {
      props: { appendTo: 'body', size: 'small' },
      slots: {
        default: () =>
          h(
            WkConfigProvider,
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
    const wrapper = mount(WkConfigProvider, {
      props: {
        componentDefaults: { Space: { size: 24 } },
      },
      slots: {
        default: () => h(WkSpace, null, { default: () => [h('span', 'A'), h('span', 'B')] }),
      },
    })
    expect(wrapper.get('.wk-space').element.style.gap).toBe('24px')
  })

  it('inherits plugin defaults when the provider only sets a subset', () => {
    const wrapper = mount(WkConfigProvider, {
      props: { density: 'compact', globalDensity: false },
      global: {
        plugins: [createWiseKit({ size: 'small', components: false })],
      },
      slots: {
        default: () => h(WkInput, { modelValue: '', 'onUpdate:modelValue': () => undefined }),
      },
    })
    expect(wrapper.get('.wk-input').classes()).toContain('wk-input--small')
    expect(wrapper.get('.wk-config-provider').attributes('data-wk-density')).toBe('compact')
  })

  it('applyTheme writes data-theme on documentElement', () => {
    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    applyTheme('light')
  })

  it('applies theme to documentElement and restores on unmount', async () => {
    document.documentElement.dataset.theme = 'light'
    const Probe = defineComponent({
      setup() {
        const config = useWkConfig()
        return () => h('span', { 'data-theme': String(config.value.theme) })
      },
    })
    const wrapper = mount(WkConfigProvider, {
      props: { theme: 'dark', zIndex: 2400, globalDensity: true },
      attachTo: document.body,
      slots: { default: () => h(Probe) },
    })
    await nextTick()
    await flushPromises()
    expect(wrapper.get('span').attributes('data-theme')).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.style.getPropertyValue('--wk-z-base')).toBe('2400')
    wrapper.unmount()
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('cleans up z-index base on unmount', async () => {
    document.documentElement.style.setProperty('--wk-z-base', '1000')
    const wrapper = mount(WkConfigProvider, {
      props: { zIndex: 2400, globalDensity: true },
      slots: { default: () => h('span', 'x') },
    })
    await nextTick()
    await flushPromises()
    expect(document.documentElement.style.getPropertyValue('--wk-z-base')).toBe('2400')
    wrapper.unmount()
    expect(document.documentElement.style.getPropertyValue('--wk-z-base')).toBe('1000')
  })
})
