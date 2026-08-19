import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdPickList from './PickList.vue'

describe('WdPickList', () => {
  it('moves selected source items to target', async () => {
    const wrapper = mount(WdPickList, {
      props: { source: ['a', 'b'], target: ['c'] },
    })
    await wrapper.findAll('.wd-picklist__listbox')[0]!.findAll('.wd-picklist__item')[0]!.trigger('click')
    await wrapper.find('[aria-label="移到右侧"]').trigger('click')
    expect(wrapper.emitted('update:source')?.at(-1)).toEqual([['b']])
    expect(wrapper.emitted('update:target')?.at(-1)).toEqual([['c', 'a']])
  })

  it('moves all to target', async () => {
    const wrapper = mount(WdPickList, {
      props: { source: ['a', 'b'], target: [] },
    })
    await wrapper.find('[aria-label="全部移到右侧"]').trigger('click')
    expect(wrapper.emitted('update:source')?.at(-1)).toEqual([[]])
    expect(wrapper.emitted('update:target')?.at(-1)).toEqual([['a', 'b']])
  })
})
