import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { resetToastService, toast, toastState } from './toast'
import WdToast from './Toast.vue'

describe('wdToast', () => {
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

  it('drops the oldest toast when max is reached', () => {
    toast.setDefaults({ max: 2 })
    toast.info({ summary: 'One', life: 0 })
    toast.info({ summary: 'Two', life: 0 })
    toast.info({ summary: 'Three', life: 0 })
    expect(toastState.messages.map((item) => item.summary)).toEqual(['Two', 'Three'])
    toast.destroyAll()
    expect(toastState.messages).toHaveLength(0)
  })

  it('dedupes by summary+detail and refreshes life', async () => {
    vi.useFakeTimers()
    const first = toast.info({ summary: 'Sync', detail: 'Pending', life: 1000 })
    toast.info({ summary: 'Sync', detail: 'Pending', life: 2000 })
    expect(toastState.messages).toHaveLength(1)
    expect(toastState.messages[0]?.id).toBe(first.id)
    await vi.advanceTimersByTimeAsync(1500)
    expect(toastState.messages).toHaveLength(1)
    await vi.advanceTimersByTimeAsync(600)
    expect(toastState.messages).toHaveLength(0)
  })

  it('pauses auto-close while hovered', async () => {
    vi.useFakeTimers()
    toast.info({ summary: 'Hover me', life: 1000 })
    await nextTick()
    const node = document.body.querySelector('.wd-toast__message')
    expect(node).toBeTruthy()
    node!.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(1500)
    expect(toastState.messages).toHaveLength(1)
    node!.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(1000)
    expect(toastState.messages).toHaveLength(0)
  })

  it('supports top center position class', async () => {
    toast.setDefaults({ position: 'top' })
    toast.info({ summary: 'Centered', life: 0 })
    await nextTick()
    expect(document.body.querySelector('.wd-toast--top')).toBeTruthy()
  })
})
