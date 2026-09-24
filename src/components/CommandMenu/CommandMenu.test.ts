import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import MCommandMenu from './CommandMenu.vue'

describe('muCommandMenu', () => {
  it('filters and runs a command', async () => {
    const command = vi.fn()
    const wrapper = mount(MCommandMenu, {
      props: {
        modelValue: true,
        model: [
          { label: 'New File', command },
          { label: 'Open Settings' },
        ],
      },
      attachTo: document.body,
    })
    await nextTick()
    const input = document.querySelector('.m-commandmenu__input') as HTMLInputElement
    expect(input).toBeTruthy()
    input.value = 'new'
    input.dispatchEvent(new Event('input'))
    await nextTick()
    const items = document.querySelectorAll('.m-commandmenu__item')
    expect(items).toHaveLength(1)
    ;(items[0] as HTMLButtonElement).click()
    await nextTick()
    expect(command).toHaveBeenCalled()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('teleports backdrop to body by default', async () => {
    const wrapper = mount(MCommandMenu, {
      props: { modelValue: true, model: [{ label: 'A' }] },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.m-commandmenu-backdrop')).toBeTruthy()
    expect(wrapper.find('.m-commandmenu-backdrop').exists()).toBe(false)
    wrapper.unmount()
  })

  it('keeps the overlay in place when teleport is false', async () => {
    const wrapper = mount(MCommandMenu, {
      props: { modelValue: true, model: [{ label: 'Stay' }], teleport: false },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.find('.m-commandmenu-backdrop').exists()).toBe(true)
    expect(document.body.querySelectorAll('.m-commandmenu-backdrop')).toHaveLength(1)
    wrapper.unmount()
  })

  it('closes on Escape', async () => {
    const wrapper = mount(MCommandMenu, {
      props: { modelValue: true, model: [{ label: 'Close me' }] },
      attachTo: document.body,
    })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('moves highlight with arrows and runs the active command on Enter', async () => {
    const first = vi.fn()
    const second = vi.fn()
    const wrapper = mount(MCommandMenu, {
      props: {
        modelValue: true,
        model: [
          { label: 'First', command: first },
          { label: 'Second', command: second },
        ],
      },
      attachTo: document.body,
    })
    await nextTick()
    const panel = document.body.querySelector('.m-commandmenu') as HTMLElement
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    expect(document.body.querySelectorAll('.m-commandmenu__item')[1]?.className).toContain(
      'm-commandmenu__item--active',
    )
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await nextTick()
    expect(second).toHaveBeenCalled()
    expect(first).not.toHaveBeenCalled()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })
})
