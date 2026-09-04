import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  beforeEach(() => localStorage.clear())

  it('switches and persists the selected theme', async () => {
    const Harness = defineComponent({ setup: () => useTheme(), template: '<div />' })
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as { toggleTheme: () => void; theme: string }

    vm.toggleTheme()
    await nextTick()

    expect(vm.theme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('wex-design-theme')).toBe('dark')
  })
})
