import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import MButton from '../Button/Button.vue'
import { h } from 'vue'
import { resetToastService, toastState } from './toast'
import { notification, useNotification } from './useNotification'

describe('useNotification', () => {
  afterEach(() => {
    vi.useRealTimers()
    resetToastService()
  })

  it('opens a notification through the toast service', async () => {
    const api = useNotification()
    api.success({ message: 'Saved', description: 'Your changes are live.' })
    await nextTick()

    expect(toastState.messages).toHaveLength(1)
    expect(toastState.messages[0]?.severity).toBe('success')
    expect(document.body.textContent).toContain('Your changes are live.')
  })

  it('treats duration as seconds', async () => {
    const api = useNotification()
    api.open({ message: 'Ping', duration: 2 })
    await nextTick()

    expect(toastState.messages[0]?.life).toBe(2000)
  })

  it('defaults to 4.5 seconds', async () => {
    const api = useNotification()
    api.open({ message: 'Ping' })
    await nextTick()

    expect(toastState.messages[0]?.life).toBe(4500)
  })

  it('maps camel-cased placements onto toast positions', async () => {
    const api = useNotification()
    api.open({ message: 'Ping', placement: 'topLeft' })
    await nextTick()

    expect(toastState.position).toBe('top-left')
  })

  it('replaces a notification when the key matches', async () => {
    const api = useNotification()
    api.open({ message: 'Loading', key: 'job' })
    await nextTick()

    api.open({ message: 'Done', type: 'success', key: 'job' })
    await nextTick()

    expect(toastState.messages).toHaveLength(1)
    expect(document.body.textContent).toContain('Done')
    expect(document.body.textContent).not.toContain('Loading')
  })

  it('does not collapse distinct keys with identical text', async () => {
    const api = useNotification()
    api.open({ message: 'Same', key: 'a' })
    api.open({ message: 'Same', key: 'b' })
    await nextTick()

    expect(toastState.messages).toHaveLength(2)
  })

  it('renders the action area', async () => {
    const api = useNotification()
    api.open({
      message: 'Delete?',
      btn: h(MButton, { severity: 'primary' }, { default: () => 'Undo' }),
    })
    await nextTick()

    expect(document.body.querySelector('.m-toast__actions')).not.toBeNull()
    expect(document.body.textContent).toContain('Undo')
  })

  it('renders a custom icon', async () => {
    const api = useNotification()
    api.open({ message: 'Ping', icon: 'info' })
    await nextTick()

    expect(document.body.querySelector('.m-toast__icon')).not.toBeNull()
  })

  it('calls onClose when the notification is closed', async () => {
    const api = useNotification()
    const onClose = vi.fn()
    api.open({ message: 'Ping', key: 'k', onClose })
    await nextTick()

    api.close('k')

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(toastState.messages).toHaveLength(0)
  })

  it('destroys every notification', async () => {
    const api = useNotification()
    api.open({ message: 'One' })
    api.open({ message: 'Two' })
    await nextTick()

    api.destroy()

    expect(toastState.messages).toHaveLength(0)
  })
})

describe('notification singleton', () => {
  afterEach(() => {
    vi.useRealTimers()
    resetToastService()
  })

  it('exposes the same surface as useNotification()', async () => {
    expect(typeof notification.open).toBe('function')
    expect(typeof notification.error).toBe('function')
    expect(typeof notification.destroy).toBe('function')

    notification.warning({ message: 'Careful' })
    await nextTick()

    expect(toastState.messages[0]?.severity).toBe('warning')
  })
})
