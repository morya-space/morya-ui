import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WiPopover from './Popover.vue'

describe('wiPopover', () => {
  it('shows content and emits lifecycle events', async () => {
    const wrapper = mount(WiPopover, {
      attachTo: document.body,
      props: { modelValue: true },
      slots: {
        default: '<button type="button">Open</button>',
        content: '<p>Popover body</p>',
      },
    })
    await nextTick()
    expect(document.body.querySelector('.wi-popover__content')?.textContent).toContain('Popover body')
    expect(document.body.querySelector('.wi-popover__content--teleported')).toBeTruthy()
    expect(wrapper.emitted('show')).toHaveLength(1)
    await wrapper.setProps({ modelValue: false })
    await nextTick()
    expect(wrapper.emitted('hide')).toHaveLength(1)
    wrapper.unmount()
  })

  it('closes on Escape and outside click', async () => {
    const wrapper = mount(WiPopover, {
      attachTo: document.body,
      props: { modelValue: true },
      slots: {
        default: '<button type="button">Open</button>',
        content: '<p>Body</p>',
      },
    })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    wrapper.unmount()

    const outside = mount(WiPopover, {
      attachTo: document.body,
      props: { modelValue: true },
      slots: {
        default: '<button type="button">Open</button>',
        content: '<p>Body</p>',
      },
    })
    await nextTick()
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(outside.emitted('update:modelValue')).toEqual([[false]])
    outside.unmount()
  })

  it('opens on hover when trigger is hover', async () => {
    const wrapper = mount(WiPopover, {
      attachTo: document.body,
      props: { modelValue: false, trigger: 'hover', showDelay: 0, hideDelay: 0, teleport: false },
      slots: {
        default: '<button type="button">Open</button>',
        content: '<p>Hover body</p>',
      },
    })
    await wrapper.trigger('mouseenter')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
    wrapper.unmount()
  })
})
