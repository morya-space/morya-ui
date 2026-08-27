import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiPagination from './Pagination.vue'

describe('wiPagination', () => {
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

  it('shows a size picker and jumper, and simple mode', async () => {
    const wrapper = mount(WiPagination, {
      props: {
        modelValue: 2,
        totalRecords: 100,
        rows: 10,
        showSizePicker: true,
        pageSizes: [10, 20],
        showQuickJumper: true,
      },
    })
    expect(wrapper.get('.wi-pagination__select').element).toBeTruthy()
    await wrapper.get('.wi-pagination__select').setValue('20')
    expect(wrapper.emitted('update:pageSize')?.at(-1)).toEqual([20])
    expect(wrapper.emitted('update:rows')?.at(-1)).toEqual([20])

    const jumper = wrapper.get('.wi-pagination__input')
    await jumper.setValue('4')
    await jumper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([4])

    const simple = mount(WiPagination, { props: { modelValue: 2, totalRecords: 40, rows: 10, simple: true } })
    expect(simple.get('.wi-pagination__simple').text()).toBe('2 / 4')
    expect(simple.find('.wi-pagination__select').exists()).toBe(false)
  })
})
