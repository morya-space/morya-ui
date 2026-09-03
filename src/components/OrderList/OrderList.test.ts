import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiOrderList from './OrderList.vue'

describe('wiOrderList', () => {
  it('reorders selected item down', async () => {
    const wrapper = mount(WiOrderList, { props: { modelValue: ['a', 'b', 'c'] } })
    await wrapper.findAll('.wi-orderlist__item')[0]!.trigger('click')
    await wrapper.find('[aria-label="下移"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['b', 'a', 'c']])
  })

  it('reorders selected item up', async () => {
    const wrapper = mount(WiOrderList, { props: { modelValue: ['a', 'b', 'c'] } })
    await wrapper.findAll('.wi-orderlist__item')[2]!.trigger('click')
    await wrapper.find('[aria-label="上移"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'c', 'b']])
  })

  it('reorders via native drag and drop from the handle', async () => {
    const wrapper = mount(WiOrderList, { props: { modelValue: ['a', 'b', 'c'] } })
    const items = wrapper.findAll('.wi-orderlist__item')
    const from = items[0]!
    const to = items[2]!
    const dataTransfer = {
      effectAllowed: 'none',
      dropEffect: 'none',
      setData: () => undefined,
      getData: () => '0',
    }

    await from.find('.wi-orderlist__handle').trigger('pointerdown')
    await from.trigger('dragstart', { dataTransfer })
    await to.trigger('dragover', { dataTransfer })
    await to.trigger('drop', { dataTransfer })

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['b', 'c', 'a']])
    expect(wrapper.emitted('reorder')?.at(-1)).toEqual([['b', 'c', 'a']])
  })

  it('does not start drag without arming the handle', async () => {
    const wrapper = mount(WiOrderList, { props: { modelValue: ['a', 'b', 'c'] } })
    const from = wrapper.findAll('.wi-orderlist__item')[0]!
    const dataTransfer = {
      effectAllowed: 'none',
      dropEffect: 'none',
      setData: () => undefined,
      getData: () => '',
    }
    await from.trigger('dragstart', { dataTransfer })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('moves selection with arrow keys and reorders with Ctrl+Arrow', async () => {
    const wrapper = mount(WiOrderList, {
      props: { modelValue: ['a', 'b', 'c'], 'onUpdate:modelValue': (value: unknown[]) => wrapper.setProps({ modelValue: value }) },
      attachTo: document.body,
    })
    const items = () => wrapper.findAll('.wi-orderlist__item')
    expect(items()[0]!.attributes('tabindex')).toBe('0')
    expect(items()[1]!.attributes('tabindex')).toBe('-1')

    const list = wrapper.get('.wi-orderlist__list')
    items()[0]!.element.focus()
    await list.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(items()[1]!.element)
    expect(items()[1]!.attributes('aria-selected')).toBe('true')

    await list.trigger('keydown', { key: 'ArrowDown', ctrlKey: true })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'c', 'b']])
    await list.trigger('keydown', { key: 'ArrowDown', ctrlKey: true })
    // already at the end: no-op
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)

    await list.trigger('keydown', { key: 'Home' })
    expect(document.activeElement).toBe(items()[0]!.element)
    wrapper.unmount()
  })
})
