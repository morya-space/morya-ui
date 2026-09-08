import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WkSplitButton from './SplitButton.vue'

const items = [
  { label: 'Save As', command: vi.fn() },
  { label: 'Export', disabled: true },
]

describe('wkSplitButton', () => {
  it('emits click from main button', async () => {
    const wrapper = mount(WkSplitButton, { props: { label: 'Save' } })
    await wrapper.find('.wk-splitbutton__main').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('teleports the menu to body by default', async () => {
    const wrapper = mount(WkSplitButton, {
      attachTo: document.body,
      props: { label: 'Save', model: items },
    })
    await wrapper.find('.wk-splitbutton__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.wk-splitbutton__menu--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('keeps the menu in place when teleport is disabled', async () => {
    const wrapper = mount(WkSplitButton, {
      props: { label: 'Save', model: items, teleport: false },
    })
    await wrapper.find('.wk-splitbutton__trigger').trigger('click')
    await nextTick()
    expect(wrapper.find('.wk-splitbutton__menu--teleported').exists()).toBe(false)
    expect(wrapper.find('[role="menu"]').exists()).toBe(true)
  })

  it('renders registered icon names with WkIcon', () => {
    const wrapper = mount(WkSplitButton, { props: { label: 'Save', icon: 'check', size: 'large' } })
    expect(wrapper.find('.wk-splitbutton__icon .wk-icon').exists()).toBe(true)
    expect(wrapper.find('.wk-splitbutton__icon .wk-icon').classes()).toContain('wk-icon--large')
  })

  it('opens menu and emits command', async () => {
    const command = vi.fn()
    const wrapper = mount(WkSplitButton, {
      props: {
        label: 'Save',
        teleport: false,
        model: [{ label: 'Save As', command }, { label: 'Export', disabled: true }],
      },
    })
    await wrapper.find('.wk-splitbutton__trigger').trigger('click')
    await wrapper.findAll('.wk-splitbutton__item')[0]!.trigger('click')
    expect(command).toHaveBeenCalled()
    expect(wrapper.emitted('command')?.[0]?.[0]).toMatchObject({ label: 'Save As' })
  })

  it('supports keyboard navigation, skipping disabled items', async () => {
    const commandC = vi.fn()
    const wrapper = mount(WkSplitButton, {
      attachTo: document.body,
      props: {
        label: 'Save',
        teleport: false,
        model: [{ label: 'A' }, { label: 'B', disabled: true }, { label: 'C', command: commandC }],
      },
    })
    const triggerEl = wrapper.get('.wk-splitbutton__trigger')
    await triggerEl.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const menu = wrapper.get('.wk-splitbutton__menu')
    expect(triggerEl.attributes('aria-controls')).toBe(menu.attributes('id'))
    const itemEls = () => wrapper.findAll('.wk-splitbutton__item')
    expect(document.activeElement).toBe(itemEls()[0]!.element)

    await menu.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(itemEls()[2]!.element)

    await menu.trigger('keydown', { key: 'Enter' })
    expect(commandC).toHaveBeenCalled()
    await nextTick()
    expect(wrapper.find('.wk-splitbutton__menu').exists()).toBe(false)
    expect(document.activeElement).toBe(triggerEl.element)
    wrapper.unmount()
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const wrapper = mount(WkSplitButton, {
      attachTo: document.body,
      props: { label: 'Save', teleport: false, model: items },
    })
    const triggerEl = wrapper.get('.wk-splitbutton__trigger')
    await triggerEl.trigger('click')
    await nextTick()
    await wrapper.get('.wk-splitbutton__menu').trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find('.wk-splitbutton__menu').exists()).toBe(false)
    expect(document.activeElement).toBe(triggerEl.element)
    wrapper.unmount()
  })
})
