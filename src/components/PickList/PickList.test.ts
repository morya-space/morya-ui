import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkPickList from './PickList.vue'

describe('wkPickList', () => {
  it('moves selected source items to target', async () => {
    const wrapper = mount(WkPickList, {
      props: { source: ['a', 'b'], target: ['c'] },
    })
    await wrapper.findAll('.wk-picklist__listbox')[0]!.findAll('.wk-picklist__item')[0]!.trigger('click')
    await wrapper.find('[aria-label="移到右侧"]').trigger('click')
    expect(wrapper.emitted('update:source')?.at(-1)).toEqual([['b']])
    expect(wrapper.emitted('update:target')?.at(-1)).toEqual([['c', 'a']])
  })

  it('moves all to target', async () => {
    const wrapper = mount(WkPickList, {
      props: { source: ['a', 'b'], target: [] },
    })
    await wrapper.find('[aria-label="全部移到右侧"]').trigger('click')
    expect(wrapper.emitted('update:source')?.at(-1)).toEqual([[]])
    expect(wrapper.emitted('update:target')?.at(-1)).toEqual([['a', 'b']])
  })

  it('shows empty message in empty lists', () => {
    const wrapper = mount(WkPickList, {
      props: { source: [], target: [] },
    })
    const emptyItems = wrapper.findAll('.wk-picklist__empty')
    expect(emptyItems).toHaveLength(2)
    expect(emptyItems[0]!.text()).toBe('暂无数据')
  })
})
