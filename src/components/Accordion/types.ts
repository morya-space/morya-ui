import type { RootPassThrough } from '../../shared/passThrough'
export interface AccordionTab {
  value: string
  header: string
  disabled?: boolean
}

export interface AccordionProps {
  pt?: RootPassThrough
  /** Active tab key(s). Use with `v-model`. */
  modelValue?: string | string[]
  /** Uncontrolled initial active key(s) when `modelValue` is omitted. */
  defaultValue?: string | string[]
  /** Allow multiple panels open. */
  multiple?: boolean
  tabs: AccordionTab[]
}

export interface AccordionEmits {
  (event: 'update:modelValue', value: string | string[]): void
}
