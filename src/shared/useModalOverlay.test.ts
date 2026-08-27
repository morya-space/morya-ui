import type {Ref} from 'vue';
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref  } from 'vue'
import { useModalOverlay } from './useModalOverlay'

describe('useModalOverlay', () => {
  it('locks scroll, handles Esc, and restores focus on close', async () => {
    const previous = document.createElement('button')
    document.body.appendChild(previous)
    previous.focus()

    const onEscape = vi.fn()
    const open = ref(false)
    const panelRef: Ref<HTMLElement | null> = ref(null)

    const Host = defineComponent({
      setup() {
        useModalOverlay({
          open,
          container: panelRef,
          blockScroll: true,
          onEscape,
        })
        return () =>
          h(
            'div',
            {
              ref: (el) => {
                panelRef.value = (el as HTMLElement | null) ?? null
              },
              tabindex: -1,
            },
            [h('button', { type: 'button' }, 'ok')],
          )
      },
    })

    const wrapper = mount(Host, { attachTo: document.body })
    open.value = true
    await nextTick()
    await nextTick()

    expect(document.body.style.overflow).toBe('hidden')
    expect(document.activeElement?.tagName).toBe('BUTTON')
    expect(document.activeElement?.textContent).toBe('ok')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(onEscape).toHaveBeenCalled()

    open.value = false
    await nextTick()
    expect(document.activeElement).toBe(previous)
    expect(document.body.style.overflow).not.toBe('hidden')

    wrapper.unmount()
    previous.remove()
  })
})
