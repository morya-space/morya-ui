import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WiMenu from './Menu.vue'

describe('WiMenu', () => {
  it('invokes command on item click', async () => {
    const command = vi.fn()
    const wrapper = mount(WiMenu, {
      props: {
        model: [
          { label: 'Open', command },
          { separator: true },
          { label: 'Off', disabled: true },
        ],
      },
    })
    const items = wrapper.findAll('.wi-menu__item')
    await items[0]!.trigger('click')
    expect(command).toHaveBeenCalledOnce()
    await items[1]!.trigger('click')
    expect(command).toHaveBeenCalledOnce()
    expect(wrapper.find('.wi-menu__separator').exists()).toBe(true)
  })

  it('hides popup until modelValue is true', async () => {
    const wrapper = mount(WiMenu, {
      props: {
        popup: true,
        modelValue: false,
        model: [{ label: 'A' }],
        teleport: false,
      },
    })
    expect(wrapper.find('.wi-menu').exists()).toBe(false)
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.find('.wi-menu').exists()).toBe(true)
  })

  it('teleports popup menu to body by default', async () => {
    const wrapper = mount(WiMenu, {
      props: {
        popup: true,
        modelValue: true,
        model: [{ label: 'A' }],
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.wi-menu--teleported')).toBeTruthy()
    wrapper.unmount()
  })
})
