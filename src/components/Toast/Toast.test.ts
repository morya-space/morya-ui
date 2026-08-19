import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import WdToast from './Toast.vue'
import { resetToastService, toast, toastState } from './toast'

describe('WdToast', () => {
  afterEach(() => {
    vi.useRealTimers()
    resetToastService()
  })

  it('renders messages and emits the closed message', async () => {
    const message = { id: 'saved', summary: 'Saved', detail: 'Your changes are live.', severity: 'success' as const }
    const wrapper = mount(WdToast, { attachTo: document.body, props: { messages: [message] } })
    expect(document.body.textContent).toContain('Your changes are live.')
    const closeButton = document.body.querySelector('.wd-toast__close')
    expect(closeButton).toBeTruthy()
    closeButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('close')).toEqual([[message]])
    wrapper.unmount()
  })

  it('maps warn severity and legacy warning to warn class', async () => {
    const messages = [
      { id: 'w1', summary: 'Warn', severity: 'warn' as const },
      { id: 'w2', summary: 'Warning', severity: 'warning' as const },
    ]
    const wrapper = mount(WdToast, { attachTo: document.body, props: { messages } })
    const nodes = document.body.querySelectorAll('.wd-toast__message')
    expect(nodes[0]?.classList.contains('wd-toast__message--warn')).toBe(true)
    expect(nodes[1]?.classList.contains('wd-toast__message--warn')).toBe(true)
    wrapper.unmount()
  })
})

describe('toast API', () => {
  afterEach(() => {
    vi.useRealTimers()
    resetToastService()
  })

  it('adds messages through the imperative API', async () => {
    toast.success({ summary: 'Saved', detail: 'Done' })
    expect(toastState.messages).toHaveLength(1)
    expect(toastState.messages[0]).toMatchObject({
      summary: 'Saved',
      detail: 'Done',
      severity: 'success',
    })
    await nextTick()
    expect(document.body.querySelector('.wd-toast')).toBeTruthy()
    expect(document.body.textContent).toContain('Saved')
  })

  it('auto-closes after life ms', async () => {
    vi.useFakeTimers()
    toast.info({ summary: 'Timed', life: 800 })
    expect(toastState.messages).toHaveLength(1)
    await vi.advanceTimersByTimeAsync(800)
    expect(toastState.messages).toHaveLength(0)
  })

  it('renders VNode summary and detail', async () => {
    const { h } = await import('vue')
    toast.info({
      summary: () => h('strong', 'Title node'),
      detail: () => h('em', 'Detail node'),
      life: 0,
    })
    await nextTick()
    expect(document.body.querySelector('.wd-toast__content strong')?.textContent).toBe('Title node')
    expect(document.body.querySelector('.wd-toast__content em')?.textContent).toBe('Detail node')
  })
})
