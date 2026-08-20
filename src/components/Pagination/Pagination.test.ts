import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiPagination from './Pagination.vue'

describe('WiPagination', () => {
  it('emits selected pages and marks the active page', async () => {
    const wrapper = mount(WiPagination, { props: { modelValue: 2, totalRecords: 40, rows: 10 } })
    expect(wrapper.get('[aria-current="page"]').text()).toBe('2')
    await wrapper.get('[aria-label="下一页"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
    expect(wrapper.emitted('page')).toEqual([[3]])
  })

  it('exposes first as a zero-based record index', () => {
    const wrapper = mount(WiPagination, { props: { modelValue: 3, totalRecords: 100, rows: 10 } })
    expect(wrapper.vm.first).toBe(20)
    expect(wrapper.vm.pageCount).toBe(10)
  })

  it('disables boundaries and does not emit when disabled', async () => {
    const wrapper = mount(WiPagination, { props: { totalRecords: 10, rows: 10, disabled: true } })
    expect(wrapper.get('[aria-label="上一页"]').attributes('disabled')).toBeDefined()
    await wrapper.get('[aria-label="下一页"]').trigger('click')
    expect(wrapper.emitted('page')).toBeUndefined()
  })
})
