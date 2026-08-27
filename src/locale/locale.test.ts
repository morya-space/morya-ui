import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { enUS, mergeLocale, zhCN } from '.'
import WiConfigProvider from '../components/ConfigProvider/ConfigProvider.vue'
import WiConfirmDialog from '../components/ConfirmDialog/ConfirmDialog.vue'
import WiPagination from '../components/Pagination/Pagination.vue'

describe('locale packs', () => {
  it('exposes matching keys for zh-CN and en-US', () => {
    expect(Object.keys(enUS).sort()).toEqual(Object.keys(zhCN).sort())
    expect(zhCN.weekdays).toHaveLength(7)
    expect(enUS.weekdays).toHaveLength(7)
    expect(zhCN.monthNames).toHaveLength(12)
    expect(enUS.monthNames).toHaveLength(12)
    expect(enUS.noMatch).toBe('No matches')
    expect(zhCN.noMatch).toBe('无匹配项')
  })

  it('keeps Chinese fallbacks when merging a partial locale', () => {
    const merged = mergeLocale({ accept: 'OK' })
    expect(merged.accept).toBe('OK')
    expect(merged.reject).toBe('取消')
    expect(merged.weekdays).toEqual(zhCN.weekdays)
  })

  it('switches ConfirmDialog copy through ConfigProvider locale', () => {
    const wrapper = mount(WiConfigProvider, {
      props: { locale: enUS, globalDensity: false },
      slots: {
        default: () => h(WiConfirmDialog, { modelValue: true, teleport: false }),
      },
    })
    expect(wrapper.text()).toContain('OK')
    expect(wrapper.text()).toContain('Cancel')
  })

  it('switches Pagination accessible names through ConfigProvider locale', () => {
    const wrapper = mount(WiConfigProvider, {
      props: { locale: enUS, globalDensity: false },
      slots: {
        default: () => h(WiPagination, { totalRecords: 40, rows: 10, modelValue: 1 }),
      },
    })
    expect(wrapper.get('[aria-label="Next page"]').attributes('aria-label')).toBe('Next page')
    expect(wrapper.get('[aria-label="Previous page"]').attributes('aria-label')).toBe('Previous page')
  })
})
