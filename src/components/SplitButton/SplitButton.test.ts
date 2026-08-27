import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WiSplitButton from './SplitButton.vue'

const items = [
  { label: 'Save As', command: vi.fn() },
  { label: 'Export', disabled: true },
]

describe('wiSplitButton', () => {
  it('emits click from main button', async () => {
    const wrapper = mount(WiSplitButton, { props: { label: 'Save' } })
    await wrapper.find('.wi-splitbutton__main').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('teleports the menu to body by default', async () => {
    const wrapper = mount(WiSplitButton, {
      attachTo: document.body,
      props: { label: 'Save', model: items },
    })
    await wrapper.find('.wi-splitbutton__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.wi-splitbutton__menu--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('keeps the menu in place when teleport is disabled', async () => {
    const wrapper = mount(WiSplitButton, {
      props: { label: 'Save', model: items, teleport: false },
    })
    await wrapper.find('.wi-splitbutton__trigger').trigger('click')
    await nextTick()
    expect(wrapper.find('.wi-splitbutton__menu--teleported').exists()).toBe(false)
    expect(wrapper.find('[role="menu"]').exists()).toBe(true)
  })

  it('opens menu and emits command', async () => {
    const command = vi.fn()
    const wrapper = mount(WiSplitButton, {
      props: {
        label: 'Save',
        teleport: false,
        model: [{ label: 'Save As', command }, { label: 'Export', disabled: true }],
      },
    })
    await wrapper.find('.wi-splitbutton__trigger').trigger('click')
    await wrapper.findAll('.wi-splitbutton__item')[0]!.trigger('click')
    expect(command).toHaveBeenCalled()
    expect(wrapper.emitted('command')?.[0]?.[0]).toMatchObject({ label: 'Save As' })
  })
})
