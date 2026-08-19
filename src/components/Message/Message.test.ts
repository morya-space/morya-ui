import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { message, messageState, resetMessageService } from './message'

describe('message API', () => {
  afterEach(() => {
    vi.useRealTimers()
    resetMessageService()
  })

  it('opens a success message at the top host', async () => {
    const handle = message.success('Saved')
    expect(messageState.items).toHaveLength(1)
    expect(messageState.items[0]).toMatchObject({
      id: handle.id,
      content: 'Saved',
      severity: 'success',
    })
    await nextTick()
    expect(document.body.querySelector('.wd-message-host')).toBeTruthy()
    expect(document.body.textContent).toContain('Saved')
  })

  it('normalizes warning to warn', () => {
    message.warning('Careful')
    expect(messageState.items[0]?.severity).toBe('warn')
  })

  it('auto-closes after life ms', async () => {
    vi.useFakeTimers()
    message.info({ content: 'Timed', life: 1000 })
    expect(messageState.items).toHaveLength(1)
    await vi.advanceTimersByTimeAsync(1000)
    expect(messageState.items).toHaveLength(0)
  })

  it('closes by handle and closeAll', () => {
    const first = message.info({ content: 'One', life: 0 })
    message.info({ content: 'Two', life: 0 })
    first.close()
    expect(messageState.items).toHaveLength(1)
    message.closeAll()
    expect(messageState.items).toHaveLength(0)
  })

  it('renders VNode content from h()', async () => {
    const { h } = await import('vue')
    message.info({ content: () => h('strong', 'Rich node'), life: 0 })
    await nextTick()
    expect(document.body.querySelector('.wd-message__content strong')?.textContent).toBe('Rich node')
  })
})
