export interface PanelProps {
  header?: string
  toggleable?: boolean
  /** Collapsed state. Prefer `v-model` / `modelValue` when both are used. */
  collapsed?: boolean
  /** Alias of `collapsed` for `v-model`. */
  modelValue?: boolean
}

export interface PanelEmits {
  (event: 'update:collapsed', value: boolean): void
  (event: 'update:modelValue', value: boolean): void
}
