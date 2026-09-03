import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiInplace from './Inplace.vue'

describe('wiInplace', () => {
  it('switches from display to content on activate', async () => {
    const wrapper = mount(WiInplace, {
      props: { modelValue: false },
      slots: {
        display: '<span>Edit me</span>',
        content: '<input class="editor" />',
      },
    })
    expect(wrapper.text()).toContain('Edit me')
    await wrapper.find('.wi-inplace__display').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('shows content when active', () => {
    const wrapper = mount(WiInplace, {
      props: { modelValue: true },
      slots: {
        display: 'Display',
        content: '<span class="active-content">Editing</span>',
      },
    })
    expect(wrapper.find('.active-content').exists()).toBe(true)
    expect(wrapper.find('.wi-inplace__display').exists()).toBe(false)
  })

  it('exposes aria-expanded and aria-disabled on the display trigger', () => {
    const wrapper = mount(WiInplace, {
      props: { modelValue: false, disabled: true },
      slots: { display: 'Display', content: 'Content' },
    })
    const display = wrapper.find('.wi-inplace__display')
    expect(display.attributes('aria-expanded')).toBe('false')
    expect(display.attributes('aria-disabled')).toBe('true')
    expect(display.attributes('tabindex')).toBe('-1')
  })

  it('emits open and close on transitions', async () => {
    const wrapper = mount(WiInplace, {
      props: { modelValue: false },
      slots: { display: 'Display', content: 'Content' },
    })
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.emitted('open')).toHaveLength(1)
    await wrapper.setProps({ modelValue: false })
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('closes on Escape when closeOnEsc is enabled', async () => {
    const wrapper = mount(WiInplace, {
      props: { modelValue: true },
      slots: { display: 'Display', content: 'Content' },
      attachTo: document.body,
    })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('ignores Escape when closeOnEsc is false', () => {
    const wrapper = mount(WiInplace, {
      props: { modelValue: true, closeOnEsc: false },
      slots: { display: 'Display', content: 'Content' },
      attachTo: document.body,
    })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('closes on outside click only when dismissable', async () => {
    const wrapper = mount(WiInplace, {
      props: { modelValue: true, dismissable: true },
      slots: { display: 'Display', content: 'Content' },
      attachTo: document.body,
    })
    await new Promise((resolve) => setTimeout(resolve, 0))
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })
})
