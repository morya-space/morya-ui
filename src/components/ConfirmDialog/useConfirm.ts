import type { ConfirmDialogProps } from './types'
import { createVNode, ref, render } from 'vue'
import { getMOverlayAppContext } from '../../shared/overlayHost'
import MConfirmDialog from './ConfirmDialog.vue'

export type ConfirmRequireOptions = Pick<
  ConfirmDialogProps,
  'header' | 'message' | 'acceptLabel' | 'rejectLabel' | 'acceptSeverity' | 'type' | 'loading'
>

/**
 * Imperative confirm dialog. Resolves `true` on accept, `false` on reject / dismiss.
 */
export function useConfirm() {
  function require(options: ConfirmRequireOptions = {}): Promise<boolean> {
    if (typeof document === 'undefined') return Promise.resolve(false)

    return new Promise((resolve) => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      let settled = false

      function finish(result: boolean) {
        if (settled) return
        settled = true
        render(null, container)
        container.remove()
        resolve(result)
      }

      const vnode = createVNode(MConfirmDialog, {
        ...options,
        modelValue: true,
        'onUpdate:modelValue': (open: boolean) => {
          if (!open) finish(false)
        },
        onAccept: () => finish(true),
        onReject: () => finish(false),
      })
      const ctx = getMOverlayAppContext()
      if (ctx) vnode.appContext = ctx
      render(vnode, container)
    })
  }

  return { require }
}
