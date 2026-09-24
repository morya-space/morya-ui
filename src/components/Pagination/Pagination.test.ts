import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import MPagination from './Pagination.vue'

describe('muPagination', () => {
  it('emits selected pages and marks the active page', async () => {
    const wrapper = mount(MPagination, { props: { modelValue: 2, totalRecords: 40, rows: 10 } })
    expect(wrapper.get('[aria-current="page"]').text()).toBe('2')
    await wrapper.get('[aria-label="下一页"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
    expect(wrapper.emitted('page')).toEqual([[3]])
  })

  it('exposes first as a zero-based record index', () => {
    const wrapper = mount(MPagination, { props: { modelValue: 3, totalRecords: 100, rows: 10 } })
    expect(wrapper.vm.first).toBe(20)
    expect(wrapper.vm.pageCount).toBe(10)
  })

  it('disables boundaries and does not emit when disabled', async () => {
    const wrapper = mount(MPagination, { props: { totalRecords: 10, rows: 10, disabled: true } })
    expect(wrapper.get('[aria-label="上一页"]').attributes('disabled')).toBeDefined()
    await wrapper.get('[aria-label="下一页"]').trigger('click')
    expect(wrapper.emitted('page')).toBeUndefined()
  })

  it('shows a size picker and jumper, and simple mode', async () => {
    const wrapper = mount(MPagination, {
      props: {
        modelValue: 2,
        totalRecords: 100,
        rows: 10,
        showSizePicker: true,
        pageSizes: [10, 20],
        showQuickJumper: true,
      },
      attachTo: document.body,
    })
    expect(wrapper.get('.m-pagination__select').element).toBeTruthy()
    await wrapper.get('.m-pagination__select').setValue('20')
    expect(wrapper.emitted('update:pageSize')?.at(-1)).toEqual([20])
    expect(wrapper.emitted('update:rows')?.at(-1)).toEqual([20])

    const jumper = wrapper.get('.m-pagination__jumper [role="combobox"]')
    expect(jumper.text()).toContain('2')
    expect(jumper.attributes('aria-label')).toBe('跳至')
    await jumper.trigger('click')
    await nextTick()
    const option = [...document.body.querySelectorAll('[role="option"]')].find((element) => element.textContent?.trim() === '4')
    expect(option).toBeInstanceOf(HTMLButtonElement)
    ;(option as HTMLButtonElement).click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([4])
    wrapper.unmount()

    const simple = mount(MPagination, { props: { modelValue: 2, totalRecords: 40, rows: 10, simple: true, showQuickJumper: true } })
    expect(simple.get('.m-pagination__simple').text()).toBe('2 / 4')
    expect(simple.find('.m-pagination__select').exists()).toBe(false)
    expect(simple.find('.m-pagination__jumper').exists()).toBe(false)
    simple.unmount()
  })

  it('filters jumper pages when there are more than 10 pages', async () => {
    const wrapper = mount(MPagination, {
      props: { modelValue: 1, totalRecords: 200, rows: 10, showQuickJumper: true },
      attachTo: document.body,
    })
    await wrapper.get('.m-pagination__jumper [role="combobox"]').trigger('click')
    await nextTick()
    const filter = document.body.querySelector('.m-select__filter')
    expect(filter).toBeInstanceOf(HTMLInputElement)
    ;(filter as HTMLInputElement).value = '12'
    filter?.dispatchEvent(new Event('input'))
    await nextTick()
    const labels = [...document.body.querySelectorAll('[role="option"]')].map((element) => element.textContent?.trim())
    expect(labels).toContain('12')
    expect(labels).not.toContain('3')
    wrapper.unmount()
  })
})
