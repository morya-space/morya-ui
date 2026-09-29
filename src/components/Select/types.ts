import type { VNodeChild } from 'vue'
import type { MRenderable } from '../../shared/content'
import type { MNativeComboboxFieldProps } from '../../shared/nativeControlProps'
import type { MAppendTo } from '../../shared/overlay'
import type { FieldPassThrough } from '../../shared/passThrough'
import type { MFieldStatus, MInputVariant, MSizeInput } from '../../shared/types'
import type { MotionPresetId } from '../../theme/motionPresets'
import type { IconName } from '../Icon/types'

export type SelectValue = string | number
export type SelectSize = MSizeInput
/** `tags` behaves like `multiple` but also lets the user create options. */
export type SelectMode = 'multiple' | 'tags'

/** Selected value shape when `labelInValue` is on. */
export interface SelectLabeledValue {
  value: SelectValue
  label: string
}

export type SelectModelValue =
  | SelectValue
  | SelectValue[]
  | SelectLabeledValue
  | SelectLabeledValue[]
  | undefined

export interface SelectOption {
  label: string
  value: SelectValue
  disabled?: boolean
}

/** One-level option group; groups are headers and are not selectable. */
export interface SelectOptionGroup {
  label: string
  options: SelectOption[]
}

export type SelectOptionEntry = SelectOption | SelectOptionGroup

/** Remap the keys the component reads from raw option objects. */
export interface SelectFieldNames {
  /** Key read for the display label. Default `'label'`. */
  label?: string
  /** Key read for the value. Default `'value'`. */
  value?: string
  /** Key read for the disabled flag. Default `'disabled'`. */
  disabled?: string
  /** Key read for nested group options. Default `'options'`. */
  options?: string
}

/** Raw option shape accepted when `fieldNames` remaps the default keys. */
export type SelectRawOption = Record<string, unknown>

export type SelectOptionInput = SelectOptionEntry | SelectRawOption
export type SelectOptions = Array<SelectOptionEntry | SelectRawOption>

export interface SelectFilterOptionContext {
  input: string
  option: SelectOption
}

export interface SelectProps extends MNativeComboboxFieldProps {
  modelValue?: SelectModelValue
  /** Options, optionally mixed with group entries. */
  options?: SelectOptions
  /** Remap the `label` / `value` / `disabled` / `options` keys of raw option objects. */
  fieldNames?: SelectFieldNames
  label?: string
  helpText?: string
  invalid?: boolean
  /**
   * Visual validate status. `error` aligns with `invalid`; `warning` is caution chrome.
   * Error/`invalid` wins over `warning`.
   */
  status?: MFieldStatus
  /** Error copy under the field; implies invalid when set. */
  errorMessage?: string
  id?: string
  disabled?: boolean
  required?: boolean
  size?: SelectSize
  /** Input surface style. */
  variant?: MInputVariant
  fluid?: boolean
  /** Multi-select mode. Omit for single select. */
  mode?: SelectMode
  /**
   * Return `{ value, label }` instead of the raw value from `v-model` and events.
   */
  labelInValue?: boolean
  /**
   * Skip local filtering and emit `search` as the query changes.
   * Pair with `showSearch` so the user can type a query.
   */
  remote?: boolean
  /** Show a loading state in the menu (async options). */
  loading?: boolean
  /** Collapse extra selected tags after this count. Ignored unless `mode` is set. */
  maxTagCount?: number
  /** Render the collapsed-tag summary. Defaults to the locale `moreTags` copy. */
  maxTagPlaceholder?: (omitted: SelectOption[]) => MRenderable
  /** Show the clear button when a value is selected. */
  allowClear?: boolean
  /** Empty / no-match content. Falls back to ConfigProvider `locale.emptyOptions`. */
  notFoundContent?: MRenderable
  /** Show a search input when the menu is open. */
  showSearch?: boolean
  /** Property of the option used for local matching. Default `'label'`. */
  optionFilterProp?: string
  /**
   * Local filter predicate. `false` disables local filtering,
   * `true` matches on `optionFilterProp`.
   */
  filterOption?: boolean | ((input: string, option: SelectOption) => boolean)
  /** Render an option row. Falls back to the `option` slot, then the label. */
  optionRender?: (option: SelectOption) => MRenderable
  /** Wrap the dropdown menu (extra chrome around the list). */
  popupRender?: (menu: VNodeChild) => VNodeChild
  /** Custom trigger icon. */
  suffixIcon?: IconName
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Mount target. Defaults to `'body'`. */
  appendTo?: MAppendTo
  placement?: 'bottom-start' | 'bottom-end'
  /** Pass-through attrs/classes/styles per DOM part. */
  pt?: FieldPassThrough
  /** Named motion preset, or `false` to disable enter/exit transition. */
  transition?: MotionPresetId | false
  /**
   * Virtualize the option list. Default auto-enables when there are 80+ options.
   * Pass `false` to always render the full list; `true` to always virtualize.
   */
  virtual?: boolean
}

export interface SelectEmits {
  (event: 'update:modelValue', value: SelectModelValue): void
  (event: 'change', value: SelectModelValue): void
  (event: 'clear'): void
  (event: 'show'): void
  (event: 'hide'): void
  (event: 'search', query: string): void
  (event: 'select', value: SelectValue, option: SelectOption): void
  (event: 'deselect', value: SelectValue, option: SelectOption): void
  (event: 'create', option: SelectOption): void
}
