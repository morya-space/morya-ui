import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WdMenubar from './Menubar.vue'

describe('wdMenubar', () => {
  it('opens one-level submenu and runs command', async () => {
    const command = vi.fn()
    const wrapper = mount(WdMenubar, {
      props: {
        model: [
          { label: 'File', items: [{ label: 'Save', command }] },
          { label: 'Edit', command: vi.fn() },
        ],
        teleport: false,
      },
      attachTo: document.body,
    })
    const triggers = wrapper.findAll('.wd-menubar__trigger')
    await triggers[0]!.trigger('click')
    expect(wrapper.find('.wd-menubar__submenu').exists()).toBe(true)
    await wrapper.get('.wd-menubar__subitem').trigger('click')
    expect(command).toHaveBeenCalledOnce()
    expect(wrapper.find('.wd-menubar__submenu').exists()).toBe(false)
    wrapper.unmount()
  })

  it('teleports submenu to body by default', async () => {
    const wrapper = mount(WdMenubar, {
      props: {
        model: [{ label: 'File', items: [{ label: 'Save' }] }],
      },
      attachTo: document.body,
    })
    await wrapper.find('.wd-menubar__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.wd-menubar__submenu--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('marks selectedKey on a leaf command', async () => {
    const wrapper = mount(WdMenubar, {
      props: { model: [{ label: 'Edit', command: vi.fn() }], selectedKey: 'Edit', teleport: false },
    })
    expect(wrapper.get('.wd-menubar__trigger--selected').text()).toContain('Edit')
  })

  it('supports top-level arrows, submenu navigation and Escape', async () => {
    const save = vi.fn()
    const wrapper = mount(WdMenubar, {
      attachTo: document.body,
      props: {
        teleport: false,
        model: [
          { label: 'File', items: [{ label: 'New' }, { label: 'Open', disabled: true }, { label: 'Save', command: save }] },
          { label: 'Edit', items: [{ label: 'Undo' }] },
        ],
      },
    })
    const triggers = () => wrapper.findAll('.wd-menubar__trigger')
    expect(triggers()[0]!.attributes('tabindex')).toBe('0')
    expect(triggers()[1]!.attributes('tabindex')).toBe('-1')

    const nav = wrapper.get('.wd-menubar')
    await nav.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(triggers()[1]!.element)
    await nav.trigger('keydown', { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(triggers()[0]!.element)

    await nav.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const submenu = () => wrapper.get('.wd-menubar__submenu')
    const subitems = () => wrapper.findAll('.wd-menubar__subitem')
    expect(document.activeElement).toBe(subitems()[0]!.element)

    await submenu().trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(subitems()[2]!.element)

    await submenu().trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.text()).toContain('Undo')
    expect(document.activeElement).toBe(subitems()[0]!.element)

    await submenu().trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find('.wd-menubar__submenu').exists()).toBe(false)
    expect(document.activeElement).toBe(triggers()[1]!.element)
    wrapper.unmount()
  })

  it('activates a submenu item with Enter', async () => {
    const save = vi.fn()
    const wrapper = mount(WdMenubar, {
      attachTo: document.body,
      props: {
        teleport: false,
        model: [{ label: 'File', items: [{ label: 'Save', command: save }] }],
      },
    })
    const nav = wrapper.get('.wd-menubar')
    await nav.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await wrapper.get('.wd-menubar__submenu').trigger('keydown', { key: 'Enter' })
    expect(save).toHaveBeenCalledOnce()
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ label: 'Save' })
    await nextTick()
    expect(wrapper.find('.wd-menubar__submenu').exists()).toBe(false)
    wrapper.unmount()
  })
})
