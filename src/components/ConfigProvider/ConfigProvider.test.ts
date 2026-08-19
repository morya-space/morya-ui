import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { useWdConfig } from '../../shared/config'
import WdInput from '../Input/Input.vue'
import WdConfigProvider from './ConfigProvider.vue'

describe('WdConfigProvider', () => {
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
})
