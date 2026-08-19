import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WdPopover from './Popover.vue'

describe('WdPopover', () => {
  it('shows content and emits lifecycle events', async () => {
    const wrapper = mount(WdPopover, {
      attachTo: document.body,
      props: { modelValue: true },
      slots: {
        default: '<button type="button">Open</button>',
        content: '<p>Popover body</p>',
      },
    })
    await nextTick()
    expect(document.body.querySelector('.wd-popover__content')?.textContent).toContain('Popover body')
    expect(document.body.querySelector('.wd-popover__content--teleported')).toBeTruthy()
    expect(wrapper.emitted('show')).toHaveLength(1)
    await wrapper.setProps({ modelValue: false })
    await nextTick()
    expect(wrapper.emitted('hide')).toHaveLength(1)
    wrapper.unmount()
  })

  it('closes on Escape and outside click', async () => {
    const wrapper = mount(WdPopover, {
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

    const outside = mount(WdPopover, {
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
})
