import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WiMegaMenu from './MegaMenu.vue'

describe('wiMegaMenu', () => {
  it('opens column panel and runs child command', async () => {
    const command = vi.fn()
    const wrapper = mount(WiMegaMenu, {
      props: {
        model: [
          {
            label: 'Products',
            items: [[{ label: 'UI Kit', command }], [{ label: 'Icons' }]],
          },
        ],
        teleport: false,
      },
    })
    await wrapper.find('.wi-megamenu__trigger').trigger('click')
    expect(wrapper.find('.wi-megamenu__panel').exists()).toBe(true)
    expect(wrapper.findAll('.wi-megamenu__column')).toHaveLength(2)
    await wrapper.findAll('.wi-megamenu__link')[0]!.trigger('click')
    expect(command).toHaveBeenCalled()
  })

  it('teleports panel to body by default', async () => {
    const wrapper = mount(WiMegaMenu, {
      props: {
        model: [
          {
            label: 'Products',
            items: [[{ label: 'UI Kit' }]],
          },
        ],
      },
      attachTo: document.body,
    })
    await wrapper.find('.wi-megamenu__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.wi-megamenu__panel--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('emits select and tracks selectedKey', async () => {
    const wrapper = mount(WiMegaMenu, {
      props: {
        teleport: false,
        model: [
          { key: 'products', label: 'Products', items: [[{ key: 'cloud', label: 'Cloud' }]] },
        ],
      },
    })
    expect(wrapper.get('.wi-megamenu').attributes('aria-label')).toBe('大型菜单')
    expect(wrapper.get('.wi-megamenu__trigger').attributes('aria-haspopup')).toBe('menu')
    await wrapper.get('.wi-megamenu__trigger').trigger('click')
    await wrapper.get('.wi-megamenu__link').trigger('click')
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ key: 'cloud' })
    expect(wrapper.emitted('update:selectedKey')?.at(-1)).toEqual(['cloud'])
    await wrapper.setProps({ selectedKey: 'cloud' })
    await wrapper.get('.wi-megamenu__trigger').trigger('click')
    expect(wrapper.get('.wi-megamenu__link').classes()).toContain('wi-megamenu__link--selected')
  })

  it('supports keyboard navigation across panel columns and Escape', async () => {
    const iot = vi.fn()
    const wrapper = mount(WiMegaMenu, {
      attachTo: document.body,
      props: {
        teleport: false,
        model: [
          {
            label: 'Products',
            items: [
              [{ label: 'Cloud' }],
              [{ label: 'Edge', disabled: true }, { label: 'IoT', command: iot }],
            ],
          },
          { label: 'Docs' },
        ],
      },
    })
    const nav = wrapper.get('.wi-megamenu')
    const triggers = () => wrapper.findAll('.wi-megamenu__trigger')
    expect(triggers()[0]!.attributes('tabindex')).toBe('0')
    expect(triggers()[1]!.attributes('tabindex')).toBe('-1')

    await nav.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const panel = () => wrapper.get('.wi-megamenu__panel')
    const links = () => wrapper.findAll('.wi-megamenu__link')
    expect(document.activeElement).toBe(links()[0]!.element)

    // flat order: Cloud, Edge (disabled), IoT — ArrowDown skips Edge
    await panel().trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(links()[2]!.element)

    await panel().trigger('keydown', { key: 'Enter' })
    expect(iot).toHaveBeenCalledOnce()
    await nextTick()
    expect(wrapper.find('.wi-megamenu__panel').exists()).toBe(false)
    expect(document.activeElement).toBe(triggers()[0]!.element)

    await nav.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await panel().trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find('.wi-megamenu__panel').exists()).toBe(false)
    expect(document.activeElement).toBe(triggers()[0]!.element)
    wrapper.unmount()
  })
})
