import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useFloatingViewportSync } from './useFloatingViewportSync'

describe('useFloatingViewportSync', () => {
  it('attaches while active and detaches when inactive', async () => {
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')
    const onChange = vi.fn()
    const active = ref(false)

    const Host = defineComponent({
      setup() {
        useFloatingViewportSync(active, onChange)
        return () => null
      },
    })
    const wrapper = mount(Host)

    active.value = true
    await nextTick()
    expect(add).toHaveBeenCalledWith('resize', onChange)
    expect(add).toHaveBeenCalledWith('scroll', onChange, true)

    active.value = false
    await nextTick()
    expect(remove).toHaveBeenCalledWith('resize', onChange)
    expect(remove).toHaveBeenCalledWith('scroll', onChange, true)

    wrapper.unmount()
    add.mockRestore()
    remove.mockRestore()
  })

  it('attaches immediately when already active on setup', () => {
    const add = vi.spyOn(window, 'addEventListener')
    const onChange = vi.fn()
    const active = ref(true)

    const Host = defineComponent({
      setup() {
        useFloatingViewportSync(active, onChange)
        return () => null
      },
    })
    const wrapper = mount(Host)

    expect(add).toHaveBeenCalledWith('resize', onChange)
    expect(add).toHaveBeenCalledWith('scroll', onChange, true)

    wrapper.unmount()
    add.mockRestore()
  })
})
