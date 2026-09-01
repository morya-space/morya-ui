import type { WiAppendTo } from '../../shared/overlay'
import type { WiSizeInput } from '../../shared/types'

export type SelectValue = string | number
export type SelectSize = WiSizeInput
/** Single-select uses a scalar; multiple uses an array. */
export type SelectModelValue = SelectValue | SelectValue[] | undefined

export interface SelectOption {
  label: string
  value: SelectValue
  disabled?: boolean
}

export interface SelectProps {
  modelValue?: SelectModelValue
  options: SelectOption[]
  label?: string
  helpText?: string
  invalid?: boolean
  /** Error copy under the field; implies invalid when set. */
  errorMessage?: string
  id?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  size?: SelectSize
  fluid?: boolean
  /** Allow selecting more than one value. `v-model` is then `SelectValue[]`. */
  multiple?: boolean
  /**
   * Create an option from the current filter query (Enter). Requires `filter`.
   * Created values use the query string as both label and value.
   */
  tag?: boolean
  /**
   * Skip local filtering and emit `search` as the query changes.
   * Pair with `filter` so the user can type a query.
   */
  remote?: boolean
  /** Show a loading state in the menu (async options). */
  loading?: boolean
  /** Collapse extra selected tags after this count. Ignored unless `multiple`. */
  maxTagCount?: number
  /** Show clear button when a value is selected. Alias: `clearable`. */
  showClear?: boolean
  /** Alias for `showClear`. */
  clearable?: boolean
  /** Empty / no-match message. Falls back to ConfigProvider `locale.emptyOptions`. */
  emptyMessage?: string
  /** Show a filter input when the menu is open (matches option labels unless `remote`). */
  filter?: boolean
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Mount target. Defaults to `'body'`. */
  appendTo?: WiAppendTo
  placement?: 'bottom-start' | 'bottom-end'
}

export interface SelectEmits {
  (event: 'update:modelValue', value: SelectModelValue): void
  (event: 'change', value: SelectModelValue): void
  (event: 'clear'): void
  (event: 'show'): void
  (event: 'hide'): void
  (event: 'search', query: string): void
  (event: 'create', option: SelectOption): void
}
