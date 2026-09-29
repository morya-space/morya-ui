/**
 * Imperative modal API — the equivalent of Ant Design's `Modal.info` /
 * `Modal.confirm` / `useModal`.
 *
 * ```ts
 * const modal = useModal()
 * modal.confirm({ title: '删除？', content: '不可撤销', onOk: () => remove() })
 * ```
 *
 * Every call returns a handle so the dialog can be updated or destroyed
 * programmatically.
 */

import type { VNode } from 'vue'
import type { DialogProps, DialogType } from './types'
import { createVNode, defineComponent, h, nextTick, onBeforeUnmount, reactive, ref, render } from 'vue'
import { getMOverlayAppContext } from '../../shared/overlayHost'
import { useMLocale } from '../../locale'
import MButton from '../Button/Button.vue'
import MDialog from './Dialog.vue'

export interface ModalStaticOptions {
  /** Dialog title. */
  title?: string
  /** Body content. */
  content?: string | VNode
  /** Status icon shown in the header. */
  type?: DialogType
  /** Confirm button label. Defaults to the locale `confirm` copy. */
  okText?: string
  /** Cancel button label. Defaults to the locale `reject` copy. */
  cancelText?: string
  /** Show the cancel button. Defaults to `false` for the status helpers. */
  showCancel?: boolean
  /** Confirm button severity. Defaults to `primary`. */
  okSeverity?: DialogProps['positiveSeverity']
  /** Dialog width, e.g. `'520px'`. */
  width?: string
  /** Placement. */
  position?: DialogProps['position']
  /** Vertically center the dialog. */
  centered?: boolean
  /** Allow dismissing by clicking the mask. Default `false`. */
  maskClosable?: boolean
  /** Called on confirm. Return a Promise to show a loading button until it settles. */
  onOk?: () => void | Promise<void>
  /** Called on cancel / dismiss. */
  onCancel?: () => void
  /** Called once the dialog has finished closing. */
  afterClose?: () => void
}

export interface ModalStaticHandle {
  /** Close and unmount the dialog. */
  destroy: () => void
  /** Patch the options while the dialog is open. */
  update: (options: Partial<ModalStaticOptions>) => void
}

export interface ModalStaticApi {
  /** Neutral message dialog (no cancel button by default). */
  info: (options: ModalStaticOptions | string) => ModalStaticHandle
  /** Success message dialog. */
  success: (options: ModalStaticOptions | string) => ModalStaticHandle
  /** Warning message dialog. */
  warning: (options: ModalStaticOptions | string) => ModalStaticHandle
  /** Error message dialog. */
  error: (options: ModalStaticOptions | string) => ModalStaticHandle
  /** Confirmation dialog with both buttons (cancel shown by default). */
  confirm: (options: ModalStaticOptions | string) => ModalStaticHandle
  /** Close every dialog created through this API. */
  destroyAll: () => void
}

const liveHandles = new Set<ModalStaticHandle>()

function normalizeOptions(input: ModalStaticOptions | string): ModalStaticOptions {
  return typeof input === 'string' ? { content: input } : { ...input }
}

function createModal(options: ModalStaticOptions): ModalStaticHandle {
  if (typeof document === 'undefined') {
    return { destroy: () => {}, update: () => {} }
  }

  const container = document.createElement('div')
  document.body.appendChild(container)

  const state = reactive<ModalStaticOptions>(normalizeOptions(options))
  const open = ref(true)
  const loading = ref(false)
  let destroyed = false

  function teardown() {
    if (destroyed) return
    destroyed = true
    liveHandles.delete(handle)

    // Detach straight away so the dialog is gone from the page immediately…
    container.remove()

    // …then unmount on the next tick. Tearing a component down while Vue is
    // mid-flush (for example from inside its own click / hide handler)
    // corrupts the effect scheduler.
    nextTick(() => render(null, container))
  }

  function close() {
    open.value = false
  }

  async function handleOk() {
    const result = state.onOk?.()
    if (result instanceof Promise) {
      loading.value = true
      try {
        await result
      }
      finally {
        loading.value = false
      }
    }
    close()
  }

  function handleCancel() {
    state.onCancel?.()
    close()
  }

  function handleHide() {
    state.afterClose?.()
    teardown()
  }

  const ModalHost = defineComponent({
    name: 'MModalHost',
    setup() {
      const locale = useMLocale()

      return () => h(
        MDialog,
        {
          modelValue: open.value,
          'onUpdate:modelValue': (value: boolean) => {
            open.value = value
          },
          title: state.title,
          type: state.type,
          width: state.width,
          position: state.position,
          centered: state.centered,
          maskClosable: state.maskClosable ?? false,
          // Render in place: the host container owns the dialog's lifetime.
          teleport: false,
          onClose: handleCancel,
          onHide: handleHide,
        },
        {
          default: () => state.content,
          footer: () => [
            state.showCancel
              ? h(
                  MButton,
                  {
                    severity: 'secondary',
                    disabled: loading.value,
                    onClick: handleCancel,
                  },
                  { default: () => state.cancelText ?? locale.value.reject ?? 'Cancel' },
                )
              : null,
            h(
              MButton,
              {
                severity: state.okSeverity ?? 'primary',
                loading: loading.value,
                onClick: () => void handleOk(),
              },
              { default: () => state.okText ?? locale.value.confirm ?? 'OK' },
            ),
          ],
        },
      )
    },
  })

  const handle: ModalStaticHandle = {
    destroy: () => {
      open.value = false
      teardown()
    },
    update: (next) => {
      Object.assign(state, normalizeOptions(next as ModalStaticOptions))
    },
  }

  const hostVNode = createVNode(ModalHost)
  const appContext = getMOverlayAppContext()
  if (appContext) hostVNode.appContext = appContext
  render(hostVNode, container)

  liveHandles.add(handle)
  return handle
}

/** Create a scoped modal API. */
export function useModal(): ModalStaticApi {
  function make(defaults: Partial<ModalStaticOptions>) {
    return (options: ModalStaticOptions | string) =>
      createModal({ ...defaults, ...normalizeOptions(options) })
  }

  return {
    info: make({ type: 'info', showCancel: false }),
    success: make({ type: 'success', showCancel: false }),
    warning: make({ type: 'warning', showCancel: false }),
    error: make({ type: 'error', showCancel: false }),
    confirm: make({ showCancel: true }),
    destroyAll: () => {
      for (const handle of [...liveHandles]) handle.destroy()
    },
  }
}

/** Module-level modal API, mirroring Ant Design's static `Modal.*` methods. */
export const modal: ModalStaticApi = useModal()

/** Detach every dialog created by the module-level `modal` API on unmount. */
export function useModalCleanup() {
  onBeforeUnmount(() => {
    for (const handle of [...liveHandles]) handle.destroy()
  })
}
