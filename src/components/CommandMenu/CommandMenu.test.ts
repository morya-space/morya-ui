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
})
