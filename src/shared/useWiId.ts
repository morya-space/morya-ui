import { getCurrentInstance } from 'vue'

let fallbackId = 0

/** Stable unique id for a11y attributes; works on Vue 3.3+ (replaces Vue 3.5 `useId`). */
export function useWiId(prefix = 'wi'): string {
  const instance = getCurrentInstance()
  return `${prefix}-${instance?.uid ?? ++fallbackId}`
}
