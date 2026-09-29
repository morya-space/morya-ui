import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import MTour from './Tour.vue'

describe('muTour', () => {
  it('renders panel when open with step copy', async () => {
    const target = document.createElement('button')
    target.textContent = 'Target'
    document.body.appendChild(target)

    const wrapper = mount(MTour, {
      props: {
        open: true,
        steps: [
          { title: 'Welcome', description: 'Step one', target: () => target },
          { title: 'Done', description: 'Step two' },
        ],
        current: 0,
      },
      attachTo: document.body,
    })

    await nextTick()
    expect(document.body.querySelector('.m-tour__title')?.textContent).toBe('Welcome')
    expect(document.body.querySelector('.m-tour__description')?.textContent).toBe('Step one')
    wrapper.unmount()
    target.remove()
  })

  it('emits update:open when closed', async () => {
    const wrapper = mount(MTour, {
      props: {
        open: true,
        steps: [{ title: 'Only' }],
      },
      attachTo: document.body,
    })
    await nextTick()
    await document.body.querySelector<HTMLButtonElement>('.m-tour__close')?.click()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('closes on Escape and navigates with arrow keys', async () => {
    const wrapper = mount(MTour, {
      props: {
        open: true,
        current: 1,
        'onUpdate:current': (v: number) => wrapper.setProps({ current: v }),
        'onUpdate:open': (v: boolean) => wrapper.setProps({ open: v }),
        steps: [
          { title: 'One' },
          { title: 'Two' },
          { title: 'Three' },
        ],
      },
      attachTo: document.body,
    })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:current')?.at(-1)).toEqual([0])
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:current')?.at(-1)).toEqual([1])
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('advances current on next', async () => {
    const wrapper = mount(MTour, {
      props: {
        open: true,
        current: 0,
        'onUpdate:current': (v: number) => wrapper.setProps({ current: v }),
        steps: [
          { title: 'One', description: 'A' },
          { title: 'Two', description: 'B' },
        ],
      },
      attachTo: document.body,
    })
    await nextTick()
    const actions = document.body.querySelectorAll('.m-tour__actions button')
    await actions[actions.length - 1]?.click()
    await nextTick()
    expect(wrapper.props('current')).toBe(1)
    wrapper.unmount()
  })
})
