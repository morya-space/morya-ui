import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WdSpeedDial from './SpeedDial.vue'

describe('wdSpeedDial', () => {
  it('toggles open state', async () => {
    const wrapper = mount(WdSpeedDial, {
      props: { modelValue: false, model: [{ label: 'Edit', icon: '✎' }] },
    })
    await wrapper.find('.wd-speeddial__button').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
  })

  it('runs item command when open', async () => {
    const command = vi.fn()
    const wrapper = mount(WdSpeedDial, {
      props: {
        modelValue: true,
        model: [{ label: 'Edit', command }],
        teleport: false,
      },
    })
    await wrapper.find('.wd-speeddial__action').trigger('click')
    expect(command).toHaveBeenCalled()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
  })

  it('teleports action list to body by default', async () => {
    const wrapper = mount(WdSpeedDial, {
      props: {
        modelValue: true,
        model: [{ label: 'Edit' }],
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.wd-speeddial__list--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('navigates actions with direction-aware arrows and closes on Escape', async () => {
    const wrapper = mount(WdSpeedDial, {
      attachTo: document.body,
      props: {
        modelValue: false,
        direction: 'up',
        teleport: false,
        model: [{ label: 'Edit' }, { label: 'Delete' }, { label: 'Share' }],
        'onUpdate:modelValue': (value: boolean) => wrapper.setProps({ modelValue: value }),
      },
    })
    const buttonEl = wrapper.get('.wd-speeddial__button')
    await buttonEl.trigger('keydown', { key: 'ArrowUp' })
    await nextTick()
    await nextTick()
    const list = wrapper.get('.wd-speeddial__list')
    expect(buttonEl.attributes('aria-controls')).toBe(list.attributes('id'))
    const actions = () => wrapper.findAll('.wd-speeddial__action')
    expect(document.activeElement).toBe(actions()[0]!.element)

    // direction="up": ArrowUp moves outward, i.e. to the next action
    await list.trigger('keydown', { key: 'ArrowUp' })
    expect(document.activeElement).toBe(actions()[1]!.element)
    await list.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(actions()[0]!.element)

    await list.trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.props('modelValue')).toBe(false)
    expect(document.activeElement).toBe(buttonEl.element)
    wrapper.unmount()
  })

  it('closes when clicking outside', async () => {
    const wrapper = mount(WdSpeedDial, {
      attachTo: document.body,
      props: {
        modelValue: true,
        teleport: false,
        model: [{ label: 'Edit' }],
        'onUpdate:modelValue': (value: boolean) => wrapper.setProps({ modelValue: value }),
      },
    })
    await nextTick()
    document.body.click()
    await nextTick()
    expect(wrapper.props('modelValue')).toBe(false)
    wrapper.unmount()
  })
})
