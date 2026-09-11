import type { RootPassThrough } from '../../shared/passThrough'
export interface InplaceProps {
  pt?: RootPassThrough
  modelValue?: boolean
  disabled?: boolean
  /** Close the content with Escape. Defaults to `true`. */
  closeOnEsc?: boolean
  /** Close the content when clicking outside of it. Defaults to `false`. */
  dismissable?: boolean
}

export interface InplaceEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'open'): void
  (event: 'close'): void
}
