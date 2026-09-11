import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { applyReducedMotionPolicy, useMotion } from './useMotion'

describe('useMotion', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.mMotion
    delete document.documentElement.dataset.mIgnoreReducedMotion
  })

  it('applies and persists a global motion preference', async () => {
    const Harness = defineComponent({ setup: () => useMotion(), template: '<div />' })
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as { setMotion: (value: 'none') => void; preference: string }

    vm.setMotion('none')
    await nextTick()

    expect(vm.preference).toBe('none')
    expect(document.documentElement.dataset.mMotion).toBe('none')
    expect(document.documentElement.getAttribute('data-m-motion')).toBe('none')
    expect(localStorage.getItem('morya-ui-motion')).toBe('none')
  })

  it('respects OS reduced motion by default', () => {
    applyReducedMotionPolicy(undefined)
    expect(document.documentElement.dataset.mIgnoreReducedMotion).toBeUndefined()

    applyReducedMotionPolicy(true)
    expect(document.documentElement.dataset.mIgnoreReducedMotion).toBeUndefined()
  })

  it('can opt out of OS reduced motion', () => {
    applyReducedMotionPolicy(false)
    expect(document.documentElement.dataset.mIgnoreReducedMotion).toBe('true')
    expect(document.documentElement.getAttribute('data-m-ignore-reduced-motion')).toBe('true')

    applyReducedMotionPolicy(undefined)
    expect(document.documentElement.dataset.mIgnoreReducedMotion).toBeUndefined()
  })
})
