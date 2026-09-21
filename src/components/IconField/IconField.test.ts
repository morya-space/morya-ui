import { mount, flushPromises } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import MIconField from './IconField.vue'
import MInput from '../Input/Input.vue'

describe('muIconField', () => {
  it('defaults to left icon position', () => {
    const wrapper = mount(MIconField, {
      slots: {
        default: '<input />',
        icon: '🔍',
      },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['m-icon-field', 'm-icon-field--left']))
    expect(wrapper.get('.m-icon-field__icon').text()).toBe('🔍')
  })

  it('supports right icon position', () => {
    const wrapper = mount(MIconField, {
      props: { iconPosition: 'right' },
      slots: { default: '<input />', icon: '×' },
    })
    expect(wrapper.classes()).toContain('m-icon-field--right')
  })

  it('anchors the icon into an Input control shell', async () => {
    const wrapper = mount(MIconField, {
      slots: {
        icon: () => '🔍',
        default: () => h(MInput, { modelValue: '', placeholder: 'Search', fluid: true }),
      },
    })
    await flushPromises()
    await nextTick()
    expect(wrapper.classes()).toContain('m-icon-field--anchored')
    expect(wrapper.get('.m-input-field__control .m-icon-field__icon').text()).toBe('🔍')
  })
})
