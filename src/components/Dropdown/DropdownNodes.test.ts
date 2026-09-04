import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import DropdownNodes from './DropdownNodes.vue'

describe('DropdownNodes', () => {
  it('selects leaf items and highlights on hover', async () => {
    const wrapper = mount(DropdownNodes, {
      props: {
        items: [
          { value: 'edit', label: 'Edit' },
          { type: 'divider' as const },
          { value: 'del', label: 'Delete', disabled: true },
        ],
      },
    })

    await wrapper.get('.wd-dropdown__item').trigger('mouseenter')
    expect(wrapper.emitted('highlight')?.[0]).toEqual(['edit'])
    await wrapper.get('.wd-dropdown__item').trigger('click')
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ value: 'edit' })
    expect(wrapper.find('.wd-dropdown__separator').exists()).toBe(true)
  })

  it('opens flyout submenu on parent hover', async () => {
    const wrapper = mount(DropdownNodes, {
      props: {
        items: [{ value: 'more', label: 'More', items: [{ value: 'a', label: 'A' }] }],
      },
    })
    await wrapper.get('.wd-dropdown__submenu-wrap').trigger('mouseenter')
    expect(wrapper.find('.wd-dropdown__submenu').exists()).toBe(true)
  })
})
