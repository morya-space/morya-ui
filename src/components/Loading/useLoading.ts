import type { LoadingServiceInstance, LoadingServiceOptions } from './types'
import { onBeforeUnmount } from 'vue'
import { loading } from './loading'

export interface UseLoadingReturn {
  open: (options?: LoadingServiceOptions) => LoadingServiceInstance
  close: () => void
  setText: (text: string) => void
}

/**
 * Imperative loading helper that closes automatically when the caller unmounts.
 */
export function useLoading(defaults: LoadingServiceOptions = {}): UseLoadingReturn {
  let instance: LoadingServiceInstance | null = null

  function close() {
    instance?.close()
    instance = null
  }

  onBeforeUnmount(() => {
    instance?.destroy()
    instance = null
  })

  return {
    open(options = {}) {
      close()
      instance = loading.service({ ...defaults, ...options })
      return instance
    },
    close,
    setText(text: string) {
      instance?.setText(text)
    },
  }
}
