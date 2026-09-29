import { flushPromises } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { modal, useModal } from './useModal'

function footerButtons(): HTMLButtonElement[] {
  return [...document.querySelectorAll<HTMLButtonElement>('.m-dialog__footer .m-button')]
}

function clickButton(button: HTMLButtonElement | undefined) {
  button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
}

afterEach(async () => {
  modal.destroyAll()
  await nextTick()
})

describe('useModal', () => {
  it('renders a confirmation dialog with both buttons', async () => {
    const api = useModal()
    const handle = api.confirm({ title: 'Delete?', content: 'Cannot be undone' })
    await nextTick()

    expect(document.body.querySelector('.m-dialog')).not.toBeNull()
    expect(document.body.textContent).toContain('Delete?')
    expect(footerButtons()).toHaveLength(2)

    handle.destroy()
    await nextTick()
    await nextTick()
    expect(document.body.querySelector('.m-dialog')).toBeNull()
  })

  it('accepts a plain string as the content', async () => {
    const api = useModal()
    const handle = api.info('Heads up')
    await nextTick()

    expect(document.body.textContent).toContain('Heads up')

    handle.destroy()
  })

  it('hides the cancel button for the status helpers', async () => {
    const api = useModal()
    const handle = api.success({ title: 'Saved' })
    await nextTick()

    expect(footerButtons()).toHaveLength(1)

    handle.destroy()
  })

  it('calls onOk when the confirm button is clicked', async () => {
    const api = useModal()
    const onOk = vi.fn()
    const handle = api.confirm({ title: 'Go?', onOk })
    await nextTick()

    clickButton(footerButtons().at(-1))
    await flushPromises()

    expect(onOk).toHaveBeenCalledTimes(1)

    handle.destroy()
  })

  it('calls onCancel when the cancel button is clicked', async () => {
    const api = useModal()
    const onCancel = vi.fn()
    const handle = api.confirm({ title: 'Go?', onCancel })
    await nextTick()

    clickButton(footerButtons().at(0))
    await flushPromises()

    expect(onCancel).toHaveBeenCalledTimes(1)

    handle.destroy()
  })

  it('keeps the button in a loading state until an async onOk settles', async () => {
    const api = useModal()
    let release: (() => void) | undefined
    const onOk = vi.fn(() => new Promise<void>((resolve) => {
      release = resolve
    }))

    const handle = api.confirm({ title: 'Go?', onOk })
    await nextTick()

    clickButton(footerButtons().at(-1))
    await nextTick()

    expect(document.body.querySelector('.m-button--loading')).not.toBeNull()

    release?.()
    await flushPromises()

    handle.destroy()
  })

  it('patches options through the handle', async () => {
    const api = useModal()
    const handle = api.confirm({ title: 'First' })
    await nextTick()

    handle.update({ title: 'Second' })
    await nextTick()

    expect(document.body.textContent).toContain('Second')

    handle.destroy()
  })

  it('destroyAll closes every open dialog', async () => {
    const api = useModal()
    api.info('one')
    api.info('two')
    await nextTick()

    expect(document.body.querySelectorAll('.m-dialog').length).toBeGreaterThanOrEqual(2)

    modal.destroyAll()
    await nextTick()
    await nextTick()
    expect(document.body.querySelectorAll('.m-dialog')).toHaveLength(0)
  })
})
