export interface AccordionTab {
  value: string
  header: string
  disabled?: boolean
}

export interface AccordionProps {
  /** Active tab key(s). Use with `v-model`. */
  modelValue?: string | string[]
  /** Allow multiple panels open. */
  multiple?: boolean
  tabs: AccordionTab[]
}

export interface AccordionEmits {
  (event: 'update:modelValue', value: string | string[]): void
}
