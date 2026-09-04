import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { createWexDesign, useWdConfig } from '../../shared/config'
import { applyTheme } from '../../theme'
import WdInput from '../Input/Input.vue'
import WdSpace from '../Space/Space.vue'
import WdConfigProvider from './ConfigProvider.vue'

describe('wdConfigProvider', () => {
  it('provides merged global config to descendants', () => {
    const Probe = defineComponent({
      setup() {
        const config = useWdConfig()
        return () => h('span', { 'data-append': String(config.value.appendTo) }, config.value.locale?.accept)
      },
    })

    const wrapper = mount(WdConfigProvider, {
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
    const wrapper = mount(WdConfigProvider, {
      props: {
        size: 'small',
        inputVariant: 'filled',
      },
      slots: {
        default: () => h(WdInput, { modelValue: 'hi', 'onUpdate:modelValue': () => undefined }),
      },
    })

    const input = wrapper.get('.wd-input')
    expect(input.classes()).toContain('wd-input--small')
    expect(input.classes()).toContain('wd-input--filled')
  })

  it('exposes density on the provider root', () => {
    const wrapper = mount(WdConfigProvider, {
      props: { density: 'compact', globalDensity: false },
      slots: { default: () => h('span', 'x') },
    })
    expect(wrapper.get('.wd-config-provider').attributes('data-wd-density')).toBe('compact')
  })

  it('writes overlay z-index base as a CSS variable', () => {
    const wrapper = mount(WdConfigProvider, {
      props: { zIndex: 2200, globalDensity: false },
      slots: { default: () => h('span', 'x') },
    })
    const style = wrapper.get('.wd-config-provider').attributes('style') ?? ''
    expect(style).toContain('--wd-z-base: 2200')
  })

  it('applies per-component defaults without changing global size for other components', () => {
    const wrapper = mount(WdConfigProvider, {
      props: {
        size: 'large',
        componentDefaults: {
          Input: { size: 'small', variant: 'filled', clearable: true },
        },
      },
      slots: {
        default: () => h(WdInput, { modelValue: 'draft', 'onUpdate:modelValue': () => undefined }),
      },
    })

    const input = wrapper.get('.wd-input')
    expect(input.classes()).toContain('wd-input--small')
    expect(input.classes()).toContain('wd-input--filled')
    expect(wrapper.get('.wd-input__clear').exists()).toBe(true)
  })

  it('lets local props override componentDefaults', () => {
    const wrapper = mount(WdConfigProvider, {
      props: {
        componentDefaults: { Input: { size: 'small' } },
      },
      slots: {
        default: () =>
          h(WdInput, { modelValue: '', size: 'large', 'onUpdate:modelValue': () => undefined }),
      },
    })
    expect(wrapper.get('.wd-input').classes()).toContain('wd-input--large')
  })

  it('inherits parent config in nested providers', () => {
    const Probe = defineComponent({
      setup() {
        const config = useWdConfig()
        return () =>
          h('span', {
            'data-append': String(config.value.appendTo),
            'data-size': String(config.value.size),
            'data-density': String(config.value.density),
          })
      },
    })

    const wrapper = mount(WdConfigProvider, {
      props: { appendTo: 'body', size: 'small' },
      slots: {
        default: () =>
          h(
            WdConfigProvider,
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
    const wrapper = mount(WdConfigProvider, {
      props: {
        componentDefaults: { Space: { size: 24 } },
      },
      slots: {
        default: () => h(WdSpace, null, { default: () => [h('span', 'A'), h('span', 'B')] }),
      },
    })
    expect(wrapper.get('.wd-space').element.style.gap).toBe('24px')
  })

  it('inherits plugin defaults when the provider only sets a subset', () => {
    const wrapper = mount(WdConfigProvider, {
      props: { density: 'compact', globalDensity: false },
      global: {
        plugins: [createWexDesign({ size: 'small', components: false })],
      },
      slots: {
        default: () => h(WdInput, { modelValue: '', 'onUpdate:modelValue': () => undefined }),
      },
    })
    expect(wrapper.get('.wd-input').classes()).toContain('wd-input--small')
    expect(wrapper.get('.wd-config-provider').attributes('data-wd-density')).toBe('compact')
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
        const config = useWdConfig()
        return () => h('span', { 'data-theme': String(config.value.theme) })
      },
    })
    const wrapper = mount(WdConfigProvider, {
      props: { theme: 'dark', zIndex: 2400, globalDensity: true },
      attachTo: document.body,
      slots: { default: () => h(Probe) },
    })
    await nextTick()
    await flushPromises()
    expect(wrapper.get('span').attributes('data-theme')).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.style.getPropertyValue('--wd-z-base')).toBe('2400')
    wrapper.unmount()
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('cleans up z-index base on unmount', async () => {
    document.documentElement.style.setProperty('--wd-z-base', '1000')
    const wrapper = mount(WdConfigProvider, {
      props: { zIndex: 2400, globalDensity: true },
      slots: { default: () => h('span', 'x') },
    })
    await nextTick()
    await flushPromises()
    expect(document.documentElement.style.getPropertyValue('--wd-z-base')).toBe('2400')
    wrapper.unmount()
    expect(document.documentElement.style.getPropertyValue('--wd-z-base')).toBe('1000')
  })
})
