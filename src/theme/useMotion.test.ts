import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { useMotion } from './useMotion'

describe('useMotion', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.wdMotion
  })

  it('applies and persists a global motion preference', async () => {
    const Harness = defineComponent({ setup: () => useMotion(), template: '<div />' })
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as { setMotion: (value: 'none') => void; preference: string }

    vm.setMotion('none')
    await nextTick()

    expect(vm.preference).toBe('none')
    expect(document.documentElement.dataset.wdMotion).toBe('none')
    expect(localStorage.getItem('wex-design-motion')).toBe('none')
  })
})
