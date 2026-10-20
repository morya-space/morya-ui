import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MOrderList from './OrderList.vue'

describe('muOrderList', () => {
  it('reorders selected item down', async () => {
    const wrapper = mount(MOrderList, { props: { modelValue: ['a', 'b', 'c'] } })
    await wrapper.findAll('.m-order-list__item')[0]!.trigger('click')
    await wrapper.find('[aria-label="下移"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['b', 'a', 'c']])
  })

  it('reorders selected item up', async () => {
    const wrapper = mount(MOrderList, { props: { modelValue: ['a', 'b', 'c'] } })
    await wrapper.findAll('.m-order-list__item')[2]!.trigger('click')
    await wrapper.find('[aria-label="上移"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'c', 'b']])
  })

  it('reorders via native drag and drop from the handle', async () => {
    const wrapper = mount(MOrderList, { props: { modelValue: ['a', 'b', 'c'] } })
    const items = wrapper.findAll('.m-order-list__item')
    const from = items[0]!
    const to = items[2]!
    const dataTransfer = {
      effectAllowed: 'none',
      dropEffect: 'none',
      setData: () => undefined,
      getData: () => '0',
    }

    await from.find('.m-order-list__handle').trigger('pointerdown')
    await from.trigger('dragstart', { dataTransfer })
    await to.trigger('dragover', { dataTransfer })
    await to.trigger('drop', { dataTransfer })

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['b', 'c', 'a']])
    expect(wrapper.emitted('reorder')?.at(-1)).toEqual([{ item: 'a', from: 0, to: 2 }])
  })

  it('does not start drag without arming the handle', async () => {
    const wrapper = mount(MOrderList, { props: { modelValue: ['a', 'b', 'c'] } })
    const from = wrapper.findAll('.m-order-list__item')[0]!
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
    const wrapper = mount(MOrderList, {
      props: { modelValue: ['a', 'b', 'c'], 'onUpdate:modelValue': (value: unknown[]) => wrapper.setProps({ modelValue: value }) },
      attachTo: document.body,
    })
    const items = () => wrapper.findAll('.m-order-list__item')
    expect(items()[0]!.attributes('tabindex')).toBe('0')
    expect(items()[1]!.attributes('tabindex')).toBe('-1')

    const list = wrapper.get('.m-order-list__options')
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

  it('shows empty message when list is empty', () => {
    const wrapper = mount(MOrderList, { props: { modelValue: [] } })
    expect(wrapper.find('.m-order-list__message').exists()).toBe(true)
    expect(wrapper.find('.m-order-list__empty-text').text()).toBe('暂无数据')
  })

  it('moves selected item to top and bottom with dedicated buttons', async () => {
    const wrapper = mount(MOrderList, { props: { modelValue: ['a', 'b', 'c', 'd'] } })
    await wrapper.findAll('.m-order-list__item')[1]!.trigger('click')
    await wrapper.find('[aria-label="移到顶部"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['b', 'a', 'c', 'd']])
    expect(wrapper.emitted('reorder')?.at(-1)).toEqual([{ item: 'b', from: 1, to: 0 }])

    await wrapper.setProps({ modelValue: ['b', 'a', 'c', 'd'] })
    await wrapper.find('[aria-label="移到底部"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'c', 'd', 'b']])
    expect(wrapper.emitted('reorder')?.at(-1)).toEqual([{ item: 'b', from: 0, to: 3 }])
  })

  it('moves to top/bottom with Ctrl+Home / Ctrl+End', async () => {
    const wrapper = mount(MOrderList, {
      props: {
        modelValue: ['a', 'b', 'c'],
        'onUpdate:modelValue': (value: unknown[]) => wrapper.setProps({ modelValue: value }),
      },
      attachTo: document.body,
    })
    const items = () => wrapper.findAll('.m-order-list__item')
    const list = wrapper.get('.m-order-list__options')
    items()[1]!.element.focus()
    await list.trigger('keydown', { key: 'End', ctrlKey: true })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'c', 'b']])
    await list.trigger('keydown', { key: 'Home', ctrlKey: true })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['b', 'a', 'c']])
    wrapper.unmount()
  })

  it('disables all interactions when disabled', async () => {
    const wrapper = mount(MOrderList, { props: { modelValue: ['a', 'b', 'c'], disabled: true } })
    const items = wrapper.findAll('.m-order-list__item')
    expect(items[0]!.attributes('draggable')).toBe('false')
    expect(items[0]!.attributes('tabindex')).toBe('-1')
    expect(wrapper.find('.m-order-list--disabled').exists()).toBe(true)
    // Buttons are all disabled.
    for (const btn of wrapper.findAll('.m-order-list__btn')) {
      expect(btn.attributes('disabled')).toBeDefined()
    }
    // Click does not select.
    await items[1]!.trigger('click')
    expect(wrapper.emitted('update:selection')).toBeUndefined()
    // Drag is blocked.
    const dataTransfer = { effectAllowed: 'none', dropEffect: 'none', setData: () => undefined }
    await items[0]!.find('.m-order-list__handle').trigger('pointerdown')
    await items[0]!.trigger('dragstart', { dataTransfer })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('supports controlled selection via v-model:selection', async () => {
    const wrapper = mount(MOrderList, {
      props: { modelValue: ['a', 'b', 'c'], selection: 2 },
    })
    expect(wrapper.findAll('.m-order-list__item')[2]!.attributes('aria-selected')).toBe('true')
    await wrapper.findAll('.m-order-list__item')[0]!.trigger('click')
    expect(wrapper.emitted('update:selection')?.at(-1)).toEqual([0])
    // Parent keeps control; selection prop unchanged until updated.
    await wrapper.setProps({ selection: 0 })
    expect(wrapper.findAll('.m-order-list__item')[0]!.attributes('aria-selected')).toBe('true')
  })

  it('shows drop-before / drop-after indicator classes by drag direction', async () => {
    const wrapper = mount(MOrderList, { props: { modelValue: ['a', 'b', 'c'] } })
    const items = () => wrapper.findAll('.m-order-list__item')
    const dataTransfer = { effectAllowed: 'none', dropEffect: 'none', setData: () => undefined }
    // Drag from index 2 over index 0 -> moving up -> drop-before on target.
    await items()[2]!.find('.m-order-list__handle').trigger('pointerdown')
    await items()[2]!.trigger('dragstart', { dataTransfer })
    await items()[0]!.trigger('dragover', { dataTransfer })
    expect(items()[0]!.classes()).toContain('m-order-list__drop-before')
    await items()[2]!.trigger('dragend')
    // Drag from index 0 over index 2 -> moving down -> drop-after on target.
    await items()[0]!.find('.m-order-list__handle').trigger('pointerdown')
    await items()[0]!.trigger('dragstart', { dataTransfer })
    await items()[2]!.trigger('dragover', { dataTransfer })
    expect(items()[2]!.classes()).toContain('m-order-list__drop-after')
    await items()[0]!.trigger('dragend')
  })
})
