/**
 * Common native control props promoted to the public component API (hybrid attrs pattern).
 * Declare these on field/control components instead of relying on fallthrough.
 */
export interface MNativeInputProps {
  /** Placeholder text shown when empty. */
  placeholder?: string
  /** Native form field name. */
  name?: string
  /** Autocomplete token (e.g. `email`, `username`). */
  autocomplete?: string
  /** Focus the control when mounted. */
  autofocus?: boolean
}

export interface MNativeTextareaProps extends MNativeInputProps {
  /** Visible row count when not autosizing. */
  rows?: number
}

/** Combobox-style fields (Select, TreeSelect, CascadeSelect). */
export interface MNativeComboboxFieldProps {
  /** Copy shown on the trigger when no value is selected. */
  placeholder?: string
  /** Native form field name (bound to auxiliary native inputs when present). */
  name?: string
}

/** Decimal text inputs (InputNumber). */
export type MNativeNumberInputProps = Pick<MNativeInputProps, 'name' | 'autofocus' | 'placeholder'>

/** Date picker readonly combobox input. */
export type MNativeDateInputProps = Pick<MNativeInputProps, 'name' | 'autocomplete' | 'autofocus'>

/** Range slider thumb input(s). */
export type MNativeRangeProps = Pick<MNativeInputProps, 'name' | 'autofocus'>
