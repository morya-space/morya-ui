import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiOrderList from './OrderList.vue'

describe('WiOrderList', () => {
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
})
