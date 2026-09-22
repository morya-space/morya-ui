import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { provideMConfig } from '../shared/config'
import { useMotionTransition } from './useMotionTransition'

describe('useMotionTransition', () => {
  it('resolves fallback when nothing is configured', () => {
    const Child = defineComponent({
      setup() {
        return useMotionTransition({
          role: 'popup',
          local: () => undefined,
          componentName: 'Select',
          fallback: 'scale-fade',
        })
      },
      template: '<div />',
    })
    const wrapper = mount(Child)
    const vm = wrapper.vm as unknown as { transitionName: string | undefined; transitionCss: boolean }
    expect(vm.transitionName).toBe('m-scale-fade')
    expect(vm.transitionCss).toBe(true)
  })

  it('honors local prop over global role and componentDefaults', async () => {
    const Child = defineComponent({
      props: {
        transition: { type: [String, Boolean] as unknown as () => string | false, default: undefined },
      },
      setup(props) {
        return useMotionTransition({
          role: 'popup',
          local: () => props.transition as string | false | undefined,
          componentName: 'Select',
          fallback: 'scale-fade',
        })
      },
      template: '<div />',
    })

    const Parent = defineComponent({
      components: { Child },
      setup() {
        provideMConfig({
          motion: { transitions: { popup: 'slide-up' } },
          componentDefaults: { Select: { transition: 'fade' } },
        })
      },
      template: '<Child :transition="local" />',
      data: () => ({ local: undefined as string | false | undefined }),
    })

    const wrapper = mount(Parent)
    const child = wrapper.findComponent(Child)
    expect((child.vm as unknown as { transitionName: string }).transitionName).toBe('m-fade')

    await wrapper.setData({ local: 'zoom' })
    await nextTick()
    expect((child.vm as unknown as { transitionName: string }).transitionName).toBe('m-zoom')

    await wrapper.setData({ local: false })
    await nextTick()
    expect((child.vm as unknown as { transitionName: string | undefined }).transitionName).toBeUndefined()
  })

  it('uses global role when componentDefaults omit transition', () => {
    const Child = defineComponent({
      setup() {
        return useMotionTransition({
          role: 'dialog',
          local: () => undefined,
          componentName: 'Dialog',
          fallback: 'dialog',
        })
      },
      template: '<div />',
    })

    const Parent = defineComponent({
      components: { Child },
      setup() {
        provideMConfig({ motion: { transitions: { dialog: 'zoom' } } })
      },
      template: '<Child />',
    })

    const wrapper = mount(Parent)
    const child = wrapper.findComponent(Child)
    expect((child.vm as unknown as { transitionName: string }).transitionName).toBe('m-zoom')
  })
})
